"""Orders serializers."""
from django.db import transaction
from rest_framework import serializers
from api.resoliq.models import Order, RegisterResidue, Residue
from api.users.serializers import UserResponseSerializer
from .clients import ClientSerializer
from .drivers import DriverSerializer
from .waste import ResidueSerializer


class RegisterResidueSerializer(serializers.ModelSerializer):
    """Register Residue serializer."""
    residue = ResidueSerializer()

    class Meta:
        """Register Residue Meta serializer."""
        model = RegisterResidue
        fields = '__all__'


class OrderRetrieveSerializer(serializers.ModelSerializer):
    """Order serializer."""
    client = ClientSerializer()
    driver = DriverSerializer()
    registers = RegisterResidueSerializer(many=True)
    performed_by = UserResponseSerializer()

    class Meta:
        """Order Meta serializer."""
        model = Order
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    """Order serializer."""

    class OrderItemInputSerializer(serializers.Serializer):
        residue = serializers.IntegerField(min_value=1)
        quantity = serializers.IntegerField(min_value=1)

    items = OrderItemInputSerializer(many=True, write_only=True, required=False)
    registers = serializers.PrimaryKeyRelatedField(
        many=True, queryset=RegisterResidue.objects.all(), required=False
    )

    def validate(self, attrs):
        movement = attrs.get("movement") or (self.instance.movement if self.instance else Order.MOVEMENT_IN)
        is_reposition = attrs.get("is_reposition") if "is_reposition" in attrs else (self.instance.is_reposition if self.instance else False)

        requires_internal_user = movement == Order.MOVEMENT_OUT or is_reposition is True
        if requires_internal_user:
            performed_by = attrs.get("performed_by")
            req = self.context.get("request")
            if performed_by is None and req and getattr(req, "user", None) and getattr(req.user, "is_authenticated", True):
                attrs["performed_by"] = req.user
        else:
            if attrs.get("client") is None and not self.instance:
                raise serializers.ValidationError({"client": "Cliente es requerido para órdenes normales."})
            if attrs.get("driver") is None and not self.instance:
                raise serializers.ValidationError({"driver": "Conductor es requerido para órdenes normales."})

        return attrs

    def _apply_inventory_and_observations(self, *, order, register_items, movement, is_reposition):
        deltas = {}
        for rr in register_items:
            deltas[rr.residue_id] = deltas.get(rr.residue_id, 0) + int(rr.quantity)

        residues = {r.id: r for r in Residue.objects.filter(id__in=deltas.keys())}
        missing = [rid for rid in deltas.keys() if rid not in residues]
        if missing:
            raise serializers.ValidationError({"registers": "Residuos inválidos."})

        if movement == Order.MOVEMENT_OUT:
            insufficient = []
            for rid, qty in deltas.items():
                if residues[rid].quantity < qty:
                    insufficient.append(residues[rid].name)
            if insufficient:
                raise serializers.ValidationError({
                    "registers": f"Stock insuficiente para: {', '.join(insufficient)}"
                })

        for rid, qty in deltas.items():
            residue = residues[rid]
            residue.quantity = residue.quantity + qty if movement == Order.MOVEMENT_IN else residue.quantity - qty
            residue.save(update_fields=["quantity"])

        prefix = "Retiro" if movement == Order.MOVEMENT_OUT else ("Reposición" if is_reposition else "Ingreso")
        for rr in register_items:
            base = f"{prefix} Orden #{order.id}."
            rr.observation = f"{base} {rr.observation}".strip() if rr.observation else base
            rr.save(update_fields=["observation"])

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items", None)
        register_ids = validated_data.pop("registers", None)
        movement = validated_data.get("movement", Order.MOVEMENT_IN)
        is_reposition = validated_data.get("is_reposition", False)

        order = Order.objects.create(**validated_data)

        register_items = []
        if items is not None:
            user = order.performed_by
            if user is None:
                req = self.context.get("request")
                user = req.user if req and getattr(req, "user", None) else None
            for it in items:
                rr = RegisterResidue.objects.create(
                    residue_id=it["residue"],
                    quantity=it["quantity"],
                    user=user,
                )
                register_items.append(rr)
        else:
            if register_ids is None:
                raise serializers.ValidationError({"registers": "Debes ingresar residuos."})
            register_items = list(register_ids)

        self._apply_inventory_and_observations(
            order=order,
            register_items=register_items,
            movement=movement,
            is_reposition=is_reposition,
        )

        order.registers.set(register_items)
        return order

    @transaction.atomic
    def update(self, instance, validated_data):
        if "items" in self.initial_data or "registers" in self.initial_data:
            raise serializers.ValidationError({"registers": "No se permite editar residuos de una orden."})

        new_movement = validated_data.get("movement", instance.movement)
        if new_movement != instance.movement:
            raise serializers.ValidationError({"movement": "No se permite cambiar el tipo de movimiento."})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    class Meta:
        """Order Meta serializer."""
        model = Order
        fields = '__all__'

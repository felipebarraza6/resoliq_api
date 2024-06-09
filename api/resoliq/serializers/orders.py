"""Orders serializers."""
from rest_framework import serializers
from api.resoliq.models import Order, RegisterResidue
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

    class Meta:
        """Order Meta serializer."""
        model = Order
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    """Order serializer."""

    class Meta:
        """Order Meta serializer."""
        model = Order
        fields = '__all__'

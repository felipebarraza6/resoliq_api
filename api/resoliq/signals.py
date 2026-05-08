"""Signals for resoliq app."""
from django.db import transaction
from django.db.models.signals import pre_delete
from django.dispatch import receiver

from api.resoliq.models import Order, RegisterResidue


@receiver(pre_delete, sender=Order)
def revert_inventory_on_order_delete(sender, instance, **kwargs):
    """
    When an Order is deleted, revert the stock changes and create
    cancellation records in the residue history.
    """
    movement = instance.movement
    is_reposition = instance.is_reposition
    registers = list(instance.registers.all())

    if not registers:
        return

    with transaction.atomic():
        prefix = "Anulación"
        order_obs = instance.observation or ""

        for rr in registers:
            residue = rr.residue
            quantity = int(rr.quantity)

            # Revert stock: IN order -> subtract, OUT order -> add back
            if movement == Order.MOVEMENT_IN:
                residue.quantity -= quantity
            else:
                residue.quantity += quantity

            residue.save(update_fields=["quantity"])

            # Create a cancellation register for history
            obs_parts = [f"{prefix} Orden #{instance.id}."]
            if order_obs:
                obs_parts.append(order_obs)
            cancellation_obs = " ".join(obs_parts)

            RegisterResidue.objects.create(
                residue=residue,
                quantity=quantity,
                user=rr.user,
                observation=cancellation_obs,
            )

        # Clean up original registers linked to the deleted order
        instance.registers.clear()
        for rr in registers:
            rr.delete()

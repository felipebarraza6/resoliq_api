"""Orders."""
from django.db import models
from api.utils.models import ModelApi
from api.resoliq.models import Client, Driver, RegisterResidue
from api.users.models import User


class Order(ModelApi):
    """Order Model."""
    MOVEMENT_IN = "IN"
    MOVEMENT_OUT = "OUT"
    MOVEMENT_CHOICES = [
        (MOVEMENT_IN, "Ingreso"),
        (MOVEMENT_OUT, "Retiro"),
    ]

    date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, blank=True, null=True)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, blank=True, null=True)
    registers = models.ManyToManyField(RegisterResidue)
    movement = models.CharField(max_length=3, choices=MOVEMENT_CHOICES, default=MOVEMENT_IN)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    is_reposition = models.BooleanField(default=False)
    observation = models.TextField(blank=True, null=True, max_length=1200)

    def __str__(self):
        return str(self.client)

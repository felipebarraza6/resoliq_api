"""Waste."""
from django.db import models
from api.utils.models import ModelApi
from api.resoliq.models import Client, Driver


class Residue(ModelApi):
    """Residue Model."""
    name = models.CharField(max_length=300)
    type_medition = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return str(self.name)


class RegisterResidue(ModelApi):
    """Register Residue Model."""
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    residue = models.ForeignKey(Residue, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return str(self.residue)

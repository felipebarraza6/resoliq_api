"""Waste."""
from django.db import models
from api.utils.models import ModelApi
from api.users.models import User


class Residue(ModelApi):
    """Residue Model."""
    name = models.CharField(max_length=300)
    type_medition = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    quantity=  models.IntegerField(default=0)

    def __str__(self):
        return str(self.name)


class RegisterResidue(ModelApi):
    """Register Residue Model."""
    residue = models.ForeignKey(Residue, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return str(self.residue)

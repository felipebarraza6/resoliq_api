""" Drivers. """
from django.db import models
from api.utils.models import ModelApi


class Driver(ModelApi):
    """Driver Model."""
    name = models.CharField(max_length=255)
    vehicle_plate = models.CharField(max_length=14, blank=True, null=True)
    dni = models.CharField(max_length=15,  blank=True, null=True)
    phone_number = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return str(self.name)

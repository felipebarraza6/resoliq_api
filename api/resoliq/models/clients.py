""" Clients."""
from django.db import models
from api.utils.models import ModelApi


class Client(ModelApi):
    """Client Model."""
    name = models.CharField(max_length=255)
    dni = models.CharField(max_length=15, blank=True, null=True)
    phone_number = models.CharField(max_length=500, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    commune = models.CharField(max_length=255, blank=True, null=True)
    contact_name = models.CharField(max_length=255, blank=True, null=True)
    executive = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return str(self.name)

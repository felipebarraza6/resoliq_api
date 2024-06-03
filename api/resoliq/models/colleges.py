"""College Model. """

from django.db import models
from api.utils.models import ModelApi

class College(ModelApi):
    name = models.CharField(max_length=250)
    address = models.CharField(max_length=1200)
    commune = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)

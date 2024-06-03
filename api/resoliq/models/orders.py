"""Orders."""
import uuid
from django.db import models
from api.utils.models import ModelApi
from api.resoliq.models import Client, Driver, RegisterResidue


class Order(ModelApi):
    """Order Model."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    registers = models.ManyToManyField(RegisterResidue)
    is_reposition = models.BooleanField(default=False)
    observation = models.TextField(blank=True, null=True, max_length=1200)

    def __str__(self):
        return str(self.client)

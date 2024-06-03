from django.db import models

from .users import User
from api.utils.models import ModelApi


class Profile(ModelApi):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return str(self.id)

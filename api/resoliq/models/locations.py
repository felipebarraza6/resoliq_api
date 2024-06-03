from django.db import models
from api.utils.models import ModelApi

class Location(ModelApi):
    driver = models.ForeignKey('users.User', on_delete=models.CASCADE)
    latitude = models.CharField(max_length=1500)
    longitude = models.CharField(max_length=1500)
    date_now = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return str(self.date_now)

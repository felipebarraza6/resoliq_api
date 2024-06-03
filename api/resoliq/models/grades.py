from django.db import models
from .colleges import College
from api.users.models import User
from api.utils.models import ModelApi

class Grade(ModelApi):
    college = models.ForeignKey(College, on_delete=models.PROTECT)
    number_grade = models.CharField(max_length=300)
    driver = models.ForeignKey(User, related_name='grade_driver',on_delete=models.PROTECT)

    def __str__(self):
        return str(self.number_grade)

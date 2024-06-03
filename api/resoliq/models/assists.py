from django.db import models
from api.utils.models import ModelApi
from .students import Student

class Assists(ModelApi):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    is_attend = models.BooleanField(default=False)
    note = models.TextField(max_length=1200, blank=True, null=True)

    def __str__(self):
        return str(self.student)



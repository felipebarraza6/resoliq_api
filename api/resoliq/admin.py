from django.contrib import admin
from api.resoliq.models import (College, Student,
                                Grade,
                                Assists, Location)
# Register your models here.


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', )


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', )


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('id', )


@admin.register(Assists)
class AssistsAdmin(admin.ModelAdmin):
    list_display = ('id', )


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', )


# Register your models here.

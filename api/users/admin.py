from django.contrib import admin
from api.users.models import User
# Register your models here.


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'type_user')

from django.contrib import admin
from api.resoliq.models import Order, Residue, RegisterResidue, Driver, Client

admin.site.register(Order)
admin.site.register(Residue)
admin.site.register(RegisterResidue)
admin.site.register(Driver)
admin.site.register(Client)


# Register your models here.

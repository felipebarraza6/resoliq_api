"""Urls Customers."""

# Django
from django.urls import include, path

# Django REST Framework
from rest_framework.routers import DefaultRouter

# Views
from api.resoliq.views import (clients as views_clients,
                               drivers as views_drivers,
                               orders as views_orders,
                               waste as views_waste,)

router = DefaultRouter()

# Actions
router.register(r'clients', views_clients.ClientViewSet,
                basename='clients')
router.register(r'drivers', views_drivers.DriverViewSet, basename='drivers')
router.register(r'orders', views_orders.OrderViewSet,
                basename='orders')
router.register(r'residues', views_waste.ResidueViewSet,
                basename='residues')
router.register(r'register-residues', views_waste.RegisterResidueViewSet,
                basename='register-residues')

urlpatterns = [
    path('', include(router.urls))
]

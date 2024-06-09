"""Drivers serializers."""
from rest_framework import serializers
from api.resoliq.models import Driver


class DriverSerializer(serializers.ModelSerializer):
    """Driver serializer."""
    class Meta:
        """Driver Meta serializer."""
        model = Driver
        fields = '__all__'

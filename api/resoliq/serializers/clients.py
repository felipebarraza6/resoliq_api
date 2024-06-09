"""Drivers serializers."""
from rest_framework import serializers
from api.resoliq.models import Client


class ClientSerializer(serializers.ModelSerializer):
    """Client serializer."""
    class Meta:
        """Client Meta serializer."""
        model = Client
        fields = '__all__'

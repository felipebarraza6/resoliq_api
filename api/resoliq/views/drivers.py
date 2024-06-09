"""View Drivers."""
from rest_framework import viewsets, mixins, permissions
from api.resoliq.models import Driver
from api.resoliq.serializers import DriverSerializer
from django_filters import rest_framework as filters


class DriverViewSet(viewsets.GenericViewSet,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    mixins.CreateModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    lookup_field = 'id'

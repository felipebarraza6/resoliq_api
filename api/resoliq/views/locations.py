from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import action

from rest_framework import status
from rest_framework import mixins, viewsets, status


from rest_framework import generics
from django_filters import rest_framework as filters
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)

from api.resoliq.models import Location
from api.resoliq.serializers import LocationModelSerializer


class LocationViewSet(mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet,):

    def get_permissions(self):
        permissions = [IsAuthenticated]
        return [p() for p in permissions]

    filter_backends = (filters.DjangoFilterBackend,)
    queryset = Location.objects.all()
    serializer_class = LocationModelSerializer
    lookup_field = 'id'

    class LocationFilter(filters.FilterSet):
        class Meta:
            model = Location
            fields = {
                'driver': ['exact'],
            }

    filterset_class = LocationFilter

    def retrieve(self, request, *args, **kwargs):
        """Add extra data to the response."""
        response = super(LocationViewSet, self).retrieve(
            request, *args, **kwargs)

        response.data = data
        return response

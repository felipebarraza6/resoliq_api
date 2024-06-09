"""View Clients."""
from rest_framework import viewsets, mixins, permissions
from api.resoliq.models import Client
from api.resoliq.serializers import ClientSerializer
from django_filters import rest_framework as filters


class ClientViewSet(viewsets.GenericViewSet,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    mixins.CreateModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    lookup_field = 'id'

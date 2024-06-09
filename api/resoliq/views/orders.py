"""View Orders."""
from rest_framework import viewsets, mixins, permissions
from api.resoliq.models import Order
from api.resoliq.serializers import OrderSerializer, OrderRetrieveSerializer
from django_filters import rest_framework as filters


class OrderViewSet(viewsets.GenericViewSet,
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.action in ['list']:
            return OrderRetrieveSerializer
        else:
            return OrderSerializer

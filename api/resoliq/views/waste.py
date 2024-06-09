"""View Waste."""
from rest_framework import viewsets, mixins, permissions
from api.resoliq.models import Residue, RegisterResidue
from api.resoliq.serializers import ResidueSerializer, RegisterResidueSerializer, ResidueListSerializer
from django_filters import rest_framework as filters


class ResidueViewSet(viewsets.GenericViewSet,
                     mixins.RetrieveModelMixin,
                     mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin):
    queryset = Residue.objects.all()
    serializer_class = ResidueSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.action in ['list']:
            return ResidueListSerializer
        else:
            return ResidueSerializer


class RegisterResidueViewSet(viewsets.GenericViewSet,
                             mixins.RetrieveModelMixin,
                             mixins.ListModelMixin,
                             mixins.CreateModelMixin,
                             mixins.UpdateModelMixin,
                             mixins.DestroyModelMixin):
    queryset = RegisterResidue.objects.all()
    serializer_class = RegisterResidueSerializer
    permission_classes = [permissions.IsAuthenticated]

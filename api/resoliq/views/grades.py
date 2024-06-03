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

from api.resoliq.models import Grade
from api.resoliq.serializers import GradeModelSerializer


class GradeViewSet(mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   mixins.DestroyModelMixin,
                   viewsets.GenericViewSet,):

    def get_permissions(self):
        permissions = [IsAuthenticated]
        return [p() for p in permissions]

    filter_backends = (filters.DjangoFilterBackend,)
    queryset = Grade.objects.all()
    serializer_class = GradeModelSerializer
    lookup_field = 'id'

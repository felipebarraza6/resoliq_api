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

from api.resoliq.models import Student
from api.resoliq.serializers import StudentModelSerializerCreate, StudentModelSerializer


class StudentViewSet(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     mixins.DestroyModelMixin,
                     viewsets.GenericViewSet,):

    def get_permissions(self):
        permissions = [IsAuthenticated]
        return [p() for p in permissions]

    filter_backends = (filters.DjangoFilterBackend,)
    queryset = Student.objects.all()
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return StudentModelSerializerCreate
        else:
            return StudentModelSerializer

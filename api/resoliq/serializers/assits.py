from rest_framework import serializers
from api.resoliq.models import Assists
from .students import StudentModelSerializer


class AssistsModelSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = Assists
        fields = '__all__'


class AssistsModelSerializer(serializers.ModelSerializer):
    student = StudentModelSerializer()

    class Meta:
        model = Assists
        fields = '__all__'

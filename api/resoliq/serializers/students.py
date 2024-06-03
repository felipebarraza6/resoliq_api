from rest_framework import serializers
from api.resoliq.models import Grade, Student
from api.users.serializers import UserModelSerializer


class GradeModelSerializer(serializers.ModelSerializer):
    driver = UserModelSerializer()

    class Meta:
        model = Grade
        fields = ('id', 'number_grade', 'college', 'driver')


class StudentModelSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class StudentModelSerializer(serializers.ModelSerializer):
    grade = GradeModelSerializer()
    guardian = UserModelSerializer()

    class Meta:
        model = Student
        fields = '__all__'

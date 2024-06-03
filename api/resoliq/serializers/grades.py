from rest_framework import serializers
from api.resoliq.models import Student, Grade
from api.users.serializers import UserResponseSerializer


class StudentModelSerializer(serializers.ModelSerializer):
    guardian = UserResponseSerializer()

    class Meta:
        model = Student
        fields = '__all__'


class GradeModelSerializer(serializers.ModelSerializer):
    students = serializers.SerializerMethodField('get_grades')

    def get_grades(self, grade):
        qs = Student.objects.filter(grade=grade)
        serializer = StudentModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    class Meta:
        model = Grade
        fields = '__all__'

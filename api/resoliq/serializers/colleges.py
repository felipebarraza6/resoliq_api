from rest_framework import serializers
from api.resoliq.models import College, Grade
from .grades import GradeModelSerializer


class CollegeModelSerializer(serializers.ModelSerializer):
    grades = serializers.SerializerMethodField('get_grades')

    def get_grades(self, college):
        qs = Grade.objects.filter(college=college)
        serializer = GradeModelSerializer(instance=qs, many=True)
        data = serializer.data
        return data

    class Meta:
        model = College
        fields = '__all__'

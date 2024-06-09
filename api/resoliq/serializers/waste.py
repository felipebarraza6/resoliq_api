"""Drivers serializers."""
from rest_framework import serializers
from api.resoliq.models import Residue, RegisterResidue
from api.users.serializers import UserModelSerializer


class ResidueSerializer(serializers.ModelSerializer):
    """Residue serializer."""
    class Meta:
        """Residue Meta serializer."""
        model = Residue
        fields = '__all__'


class RegisterResidueSerializerResidueList(serializers.ModelSerializer):
    """RegisterRessidue serializer."""
    user = UserModelSerializer()

    class Meta:
        """RegisterRessidue Meta serializer."""
        model = RegisterResidue
        fields = '__all__'


class ResidueListSerializer(serializers.ModelSerializer):
    """Residue history."""
    history_residue = serializers.SerializerMethodField("get_history_residue")

    def get_history_residue(self, obj):
        query = RegisterResidue.objects.filter(residue=obj.id)
        serializer = RegisterResidueSerializerResidueList(query, many=True)
        return serializer.data

    class Meta:
        model = Residue
        fields = '__all__'


class RegisterResidueSerializer(serializers.ModelSerializer):
    """RegisterRessidue serializer."""
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        """RegisterRessidue Meta serializer."""
        model = RegisterResidue
        fields = '__all__'

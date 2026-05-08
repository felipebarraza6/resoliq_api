"""Mixins reutilizables para ViewSets."""
from rest_framework.decorators import action
from rest_framework.response import Response


class AllRecordsMixin:
    """Agrega un action `all` que devuelve todos los registros sin paginar."""

    @action(detail=False, methods=['get'], pagination_class=None)
    def all(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

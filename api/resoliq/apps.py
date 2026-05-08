from django.apps import AppConfig


class TransportConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.resoliq'

    def ready(self):
        import api.resoliq.signals  # noqa


from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include(('api.users.router', 'users'), namespace='users')),
    path('api/', include(('api.resoliq.router', 'users'), namespace='resoliq')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

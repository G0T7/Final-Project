# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('game.urls')),  # Include app-specific URLs
    path('', TemplateView.as_view(template_name='index.html')),  # Serve your React app
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

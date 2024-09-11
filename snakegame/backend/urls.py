# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from game import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('game.urls')),  # Ensure this line is included
]

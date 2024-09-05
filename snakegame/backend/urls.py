# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from game import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', views.signup_view, name='signup'),
    path('api/login/', views.login_view, name='login'),
    path('api/user-profile/', views.user_profile_view, name='user-profile'),
    path('api/leaderboard/', views.leaderboard_view, name='leaderboard'),
    path('api/', include('game.urls')),  # Include app-specific URLs
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

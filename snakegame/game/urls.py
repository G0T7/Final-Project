# game/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'game-scores', views.GameScoreViewSet)
router.register(r'user-profiles', views.UserProfileViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Main API routes
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('user-profile/', views.user_profile_view, name='user_profile'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
    path('submit-score/', views.submit_score, name='submit_score'),
    path('ai-move/', views.ai_move, name='ai_move'),
    path('start-game/', views.start_game, name='start_game'),
    path('restart-game/', views.restart_game, name='restart_game'),
    path('save_score/', views.save_score, name='save_score'),  # Added URL pattern
]




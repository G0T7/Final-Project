# game/urls.py

from django.urls import path
from .views import signup_view, login_view, user_profile_view, leaderboard_view, submit_score, ai_move, start_game, restart_game, save_score

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('user-profile/', user_profile_view, name='user_profile'),
    path('leaderboard/', leaderboard_view, name='leaderboard'),
    path('submit-score/', submit_score, name='submit_score'),
    path('ai-move/', ai_move, name='ai_move'),
    path('start-game/', start_game, name='start_game'),
    path('restart-game/', restart_game, name='restart_game'),
    path('save_score/', save_score, name='save_score'),
]

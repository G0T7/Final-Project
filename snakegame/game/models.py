# backend/game/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class GameScore(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.PositiveIntegerField()
    date = models.DateTimeField(default=timezone.now)
    difficulty = models.CharField(
        max_length=20, 
        choices=[('Noob', 'Noob'), ('Wow', 'Wow'), ('God', 'God')],
        default='Noob'
    )

    def __str__(self):
        return f"{self.player.username} - {self.score} - {self.difficulty}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username

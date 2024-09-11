from rest_framework import serializers
from django.contrib.auth.models import User
from .models import GameScore, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['user', 'bio']

class GameScoreSerializer(serializers.ModelSerializer):
    player = UserSerializer()

    class Meta:
        model = GameScore
        fields = ['player', 'score', 'date', 'difficulty']

    def create(self, validated_data):
        player_data = validated_data.pop('player')
        user = User.objects.create(**player_data)
        game_score = GameScore.objects.create(player=user, **validated_data)
        return game_score

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import GameScore, UserProfile
from .serializers import GameScoreSerializer, UserProfileSerializer, UserSerializer
from rest_framework.authtoken.models import Token
from .ai import SnakeAI

@api_view(['GET'])
def home_view(request):
    """
    Home view for the root URL.
    """
    return Response("Welcome to the Snake Game!")

class GameScoreViewSet(viewsets.ModelViewSet):
    """
    ViewSet for GameScore model.
    """
    queryset = GameScore.objects.all().order_by('-score')
    serializer_class = GameScoreSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserProfile model.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.userprofile

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """
    API endpoint for user signup.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    UserProfile.objects.create(user=user)
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({"username": username, "token": token.key}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    API endpoint for user login.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    API endpoint for retrieving and updating user profile.
    """
    user = request.user
    if request.method == 'GET':
        try:
            profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'PUT':
        data = request.data
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        if data.get('password'):
            user.set_password(data.get('password'))
        user.save()
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.bio = data.get('bio', profile.bio)
        profile.save()
        return Response({"message": "Profile updated successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard_view(request):
    """
    API endpoint for retrieving the leaderboard.
    """
    scores = GameScore.objects.all().order_by('-score')[:10]  # Top 10 scores
    serializer = GameScoreSerializer(scores, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_score(request):
    """
    API endpoint for submitting a game score.
    """
    user = request.user
    score = request.data.get('score')
    
    if score is not None:
        GameScore.objects.create(player=user, score=score)
        return Response({"message": "Score submitted successfully"}, status=status.HTTP_201_CREATED)
    
    return Response({"error": "Invalid score"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def save_score(request):
    """
    API endpoint for saving a game score.
    """
    serializer = GameScoreSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_move(request):
    """
    API endpoint for getting the next move from the AI.
    """
    data = request.data
    board_size = data.get('board_size')
    snake_position = data.get('snake_position')
    food_position = data.get('food_position')
    
    ai = SnakeAI(board_size, snake_position, food_position)
    next_move = ai.get_next_move()
    
    return Response({'move': next_move})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_game(request):
    """
    API endpoint for starting the game.
    """
    # Placeholder for game start logic
    return Response({'status': 'Game started'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restart_game(request):
    """
    API endpoint for restarting the game.
    """
    # Placeholder for game restart logic
    return Response({'status': 'Game restarted'})

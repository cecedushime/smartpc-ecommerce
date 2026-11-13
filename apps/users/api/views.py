from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([AllowAny]) # Tout le monde peut s'inscrire
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Le nom d\'utilisateur et le mot de passe sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Ce nom d\'utilisateur est déjà pris.'}, status=status.HTTP_400_BAD_REQUEST)

    # Création de l'utilisateur
    user = User.objects.create_user(username=username, email=email, password=password)
    
    return Response({'message': 'Compte créé avec succès !'}, status=status.HTTP_201_CREATED)
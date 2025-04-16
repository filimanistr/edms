from django.db.utils import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from rest_framework import permissions

from contracts.serializers import CounterpartySerializer
from contracts.models import Counterparty
from .models import User


@api_view(["POST"])
def login(request):
    # TODO: Насколько вообще безопасно хранить токен 30 дней?
    email = request.data["email"]
    password = request.data["password"]

    user = User.objects.filter(email=email).first()

    if user is None:
        raise AuthenticationFailed("Пользователь не найден")

    if not user.check_password(password):
        raise AuthenticationFailed("Неверный пароль")

    if not hasattr(user, "counterparty"):
        raise AuthenticationFailed("Завершите инициализацию")

    try:
        token = Token.objects.create(user=user)
    except IntegrityError:
        token = Token.objects.get(user=user)

    response = Response()
    response.data = {
        "token": token.key,
        "is_admin": user.is_admin
    }

    return response


class Logout(APIView):
    def post(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class CreateUserView(generics.CreateAPIView):
    serializer_class = CounterpartySerializer
    permission_classes = [permissions.AllowAny]

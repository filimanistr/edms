from django.db.utils import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from rest_framework import permissions

from contracts.config import ADMINS
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

    payload = {
        'id': user.id
    }

    try:
        token = Token.objects.create(user=user)
    except IntegrityError:
        token = Token.objects.get(user=user)

    response = Response()
    response.data = {
        "token": token.key,
        "is_admin": user.email in ADMINS
    }

    return response


class Logout(APIView):
    def post(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class CreateUserView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    model = Counterparty
    serializer_class = CounterpartySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=True)
        if serializer.is_valid():
            try:
                instance = serializer.save()
            except IntegrityError:
                return Response({"message": "Почта уже занята", "description": "Измените почту"},
                                status=status.HTTP_400_BAD_REQUEST)
            token, created = Token.objects.get_or_create(user=instance.id)
            return Response({
                'token': token.key,
                "is_admin": instance.id.email in ADMINS
            }, status=201)

        error = serializer.errors
        if "non_field_errors" in serializer.errors:
            error = serializer.errors["non_field_errors"][0].title()

        return Response({"message": error},
                        status=status.HTTP_400_BAD_REQUEST)

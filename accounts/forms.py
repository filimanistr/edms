from django import forms

from contracts.models import Counterparty
from .config import COUNTERPARTY_MODEL_FIELDS

from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ("email",)


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ("email",)


# TODO: Удалить все что внизу к чертям

class NewCounterpartyForm(forms.ModelForm):
    """Как Serializer в DRF используется
    т.е. только для валидации данных"""
    class Meta:
        model = Counterparty
        fields = COUNTERPARTY_MODEL_FIELDS


class NewUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ["email", "password1", "password2"]



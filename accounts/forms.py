from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django import forms

from contracts.models import Counterparty
from .config import COUNTERPARTIE_MODEL_FIELDS

class NewCounterpartieForm(forms.ModelForm):
    """Как Serializer в DRF используется
    т.е. только для валидации данных"""
    class Meta:
        model = Counterparty
        fields = COUNTERPARTIE_MODEL_FIELDS

class NewUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ["username", "password1", "password2"]



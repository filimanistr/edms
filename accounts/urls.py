from django.urls import path, include

from .forms import CustomUserCreationForm
from . import views


# accounts URLconf

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("logout/", views.Logout.as_view(), name="logout"),
    path("user/", views.UserDetailsView.as_view(), name="user_details"),
]

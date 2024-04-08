from django.urls import path, include
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView

from .forms import CustomUserCreationForm
from . import views


# accounts URLconf

urlpatterns = [
    path("register/", RegisterView.as_view(), name="rest_register"),
    path("login/", views.login, name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("user/", UserDetailsView.as_view(), name="rest_user_details"),

    path('profile/',
         views.profile,
         name='profile',
         ),
    path('register/',
         views.register,
         name='register'
         ),

    path('fields/',
         views.fields,
         name='fields'
         ),
]

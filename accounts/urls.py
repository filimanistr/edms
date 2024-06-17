from django.urls import path, include
from . import views


urlpatterns = [
    path("register/", views.CreateUserView.as_view(), name="register"),
    path("login/", views.login, name="login"),
    path("logout/", views.Logout.as_view(), name="logout"),
]

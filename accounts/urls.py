from django.contrib.auth import views as auth_views
from django.urls import path
from . import views

# accounts URLconf

urlpatterns = [
    path('accounts/profile/',
         views.profile,
         name = 'profile',
    ),
    path('accounts/register/',
         views.register,
         name = 'register'
    ),
    path('accounts/login/',
         auth_views.LoginView.as_view(template_name='login.html'),
         name = 'login'
    ),
    path('accounts/logout/',
         auth_views.LogoutView.as_view(template_name='logout.html'),
         name = 'logout'
    ),

    path('api/accounts/get/fields/',
         views.fields,
         name = 'fields'
    ),
]

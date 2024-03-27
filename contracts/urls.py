from django.urls import path
from . import views

# contracts URLconf

urlpatterns = [
    path('contracts/', views.index, name='index'),

    path('api/is_admin/', views.is_admin, name='is_admin'),

    path('api/contracts/', views.contracts, name='contracts'),
    path('api/contracts/<int:contract_id>/', views.contract, name='contract'),
    path('api/contracts/fields/', views.contract_fields, name='contract_fields'),
    path('api/contracts/approve/', views.approve_contract, name='approve'),

    path('api/contracts/templates/', views.templates, name='templates'),
    path('api/counterparties/', views.counterparties, name='counterparties'),

]

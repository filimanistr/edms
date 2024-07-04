from django.urls import path
from . import views

# contracts URLconf

urlpatterns = [
    path('api/contracts/', views.ContractList.as_view(), name='contracts'),
    path('api/contracts/<int:pk>/', views.ContractDetail.as_view(), name='contract'),
    path('api/contracts/fields/', views.ContractFields.as_view(), name='contract_fields'),
    path('api/contracts/preview/', views.ContractPreview.as_view(), name='draft'),
    path('api/contracts/save/', views.ContractSave.as_view(), name='save'),

    path('api/templates/', views.Templates.as_view(), name='templates'),
    path('api/templates/<int:pk>/', views.Template.as_view(), name='template'),

    path('api/counterparties/', views.CounterpartiesView.as_view(), name='counterparties'),
    path('api/counterparty/', views.CounterpartyView.as_view(), name='counterparties'),

    path('api/services/', views.Services.as_view(), name='services'),
]

from django.urls import path
from . import views

# contracts URLconf

urlpatterns = [
    path('api/contracts/', views.ContractList.as_view(), name='contracts'),
    path('api/contracts/<int:pk>/', views.ContractDetail.as_view(), name='contract'),
    path('api/contracts/fields/', views.ContractCreationFields.as_view(), name='contract_fields'),
    path('api/contracts/preview/', views.ContractPreview.as_view(), name='draft'),
    path('api/contracts/save/', views.ContractSave.as_view(), name='save'),

    path('api/templates/', views.TemplateList.as_view(), name='templates'),
    path('api/templates/<int:pk>/', views.TemplateDetail.as_view(), name='template'),

    path('api/counterparties/', views.CounterpartyList.as_view(), name='counterparties'),
    path('api/counterparties/<int:pk>/', views.CounterpartyDetail.as_view(), name='some_counterparty'),
    path('api/counterparties/admin/', views.AdminCounterpartyDetail.as_view(), name='admin_counterparty'),
    path('api/counterparties/me/', views.CurrentCounterpartyDetail.as_view(), name='user_counterparty'),

    path('api/services/', views.ServicesList.as_view(), name='services'),
]

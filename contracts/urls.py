from django.urls import path
from . import views

# contracts URLconf

urlpatterns = [
    path('api/contracts/', views.Contracts.as_view(), name='contracts'),                     # OK
    path('api/contracts/<int:contract_id>/', views.Contract.as_view(), name='contract'),     # OK
    path('api/contracts/fields/', views.ContractFields.as_view(), name='contract_fields'),   # OK

    path('api/counterparties/', views.Counterparties.as_view(), name='counterparties'),      # OK
    path('api/templates/', views.Templates.as_view(), name='templates'),                     # OK
    path('api/services/', views.Services.as_view(), name='services'),                        # OK
]

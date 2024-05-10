from django.urls import path
from . import views

# contracts URLconf

urlpatterns = [
    path('api/contracts/', views.Contracts.as_view(), name='contracts'),
    path('api/contracts/<int:contract_id>/', views.Contract.as_view(), name='contract'),
    path('api/contracts/fields/', views.ContractFields.as_view(), name='contract_fields'),

    path('api/templates/', views.Templates.as_view(), name='templates'),
    path('api/templates/<int:template_id>/', views.Template.as_view(), name='template'),

    path('api/counterparties/', views.Counterparties.as_view(), name='counterparties'),
    path('api/services/', views.Services.as_view(), name='services'),

    # path('api/upload-file/', views.FileUploadAPIView.as_view(), name='upload-file'),
]

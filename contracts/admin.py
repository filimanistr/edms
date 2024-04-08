from django.contrib import admin
from .  import models

# Register your models here.

admin.site.register(models.Counterparty)
admin.site.register(models.ServicesReference)
admin.site.register(models.ContractTemplate)
admin.site.register(models.Contract)

admin.site.register(models.ClosingDocumentsReference)
admin.site.register(models.ContractsHistory)
admin.site.register(models.ClosingDocument)
admin.site.register(models.Payments)

from django.contrib import admin
from .  import models

# Register your models here.

admin.site.register(models.Counterparty)
admin.site.register(models.ServicesReference)
admin.site.register(models.ContractTemplate)
admin.site.register(models.Contract)


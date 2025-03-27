from rest_framework import filters

from .models import Counterparty
from .config import ADMINS


class TemplatesFilter(filters.BaseFilterBackend):
    """
    Users only get their and general templates
    """
    def filter_queryset(self, request, queryset, view):
        if request.user.email in ADMINS:
            return queryset
        admin = Counterparty.objects.get(id__email__in=ADMINS)
        return queryset.filter(creator__in=(request.user.counterparty, admin))


class ContractsFilter(filters.BaseFilterBackend):
    """
    Users get only their contracts
    """
    def filter_queryset(self, request, queryset, view):
        if request.user.email in ADMINS:
            return queryset
        return queryset.filter(counterparty__pk=request.user.pk)


class CounterpartiesFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.email in ADMINS:
            return queryset.exclude(id__email__in=ADMINS)
        return queryset.filter(counterparty__pk__in=[*ADMINS, request.user])

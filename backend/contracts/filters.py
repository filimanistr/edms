from rest_framework import filters
from django.db.models import Q

from .models import Counterparty


class TemplatesFilter(filters.BaseFilterBackend):
    """
    Users only get their and general templates
    """
    def filter_queryset(self, request, queryset, view):
        if request.user.is_admin:
            return queryset
        admin = Counterparty.objects.get(id__is_admin=True)
        return queryset.filter(creator__in=(request.user.counterparty, admin))


class ContractsFilter(filters.BaseFilterBackend):
    """
    Users get only their contracts
    """
    def filter_queryset(self, request, queryset, view):
        if request.user.is_admin:
            return queryset
        return queryset.filter(counterparty__pk=request.user.pk)


class CounterpartiesFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.is_admin:
            return queryset.exclude(id__is_admin=True)
        return queryset.filter(Q(counterparty__pk=request.user.pk) | Q(counterparty__id__is_admin=True))

from rest_framework import filters

from .models import Counterparty
from .config import ADMINS


class templatesFilter(filters.BaseFilterBackend):
    """
    Фильтрует так что заказчикам отображаются только их и общие шаблоны
    """
    def filter_queryset(self, request, queryset, view):
        if request.user.email in ADMINS:
            return queryset
        admin = Counterparty.objects.get(id__email__in=ADMINS)
        return queryset.filter(creator__in=(request.user.counterparty, admin))


class contractsFilter(filters.BaseFilterBackend):
    """
    Фильтрует так что заказчикам отображаются только их договора
    """
    def filter_queryset(self, request, queryset, view):
        if request.user.email in ADMINS:
            return queryset
        return queryset.filter(counterparty__pk=request.user.pk)

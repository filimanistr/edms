from rest_framework import permissions, exceptions
from .config import ADMINS, CONTRACT_DOES_NOT_EXIST


class IsAdminCreating(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return request.user.email in ADMINS
        return True


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.email in ADMINS


class IsContractOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.email not in ADMINS and obj.counterparty != request.user.counterparty:
            raise exceptions.NotFound(CONTRACT_DOES_NOT_EXIST)
        return True



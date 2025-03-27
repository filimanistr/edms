from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from .permissions import IsAdminCreating, IsAdminUser, IsContractOwner

from . import filters
from . import models
from .serializers import *
from .services import get_fields


class ContractList(generics.ListCreateAPIView):
    """Forms and saves new contract from the template
    can't pass arbitrary or edited contract to this view"""
    queryset = models.Contract.objects.select_related("counterparty", "template", "template__service").order_by("pk")
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.ContractsFilter]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ContractCreationSerializer
        return ContractBaseSerializer


class ContractDetail(generics.RetrieveUpdateAPIView):
    queryset = models.Contract.objects.select_related("counterparty", "template", "template__service")
    serializer_class = ContractUpdateSerializer
    permission_classes = [IsAuthenticated, IsContractOwner]
    http_method_names = ["get", "patch", "options"]


class ContractPreview(generics.CreateAPIView):
    """Forms contract's preview from existing template
    not saves to db so user can edit it and save later"""
    serializer_class = ContractPreviewSerializer
    permission_classes = [IsAuthenticated]


class ContractSave(generics.CreateAPIView):
    """Saves passed contract without forming,
    still need to be based on existing template"""
    serializer_class = ContractSaveSerializer
    permission_classes = [IsAuthenticated]


class ContractCreationFields(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        fields = get_fields()
        if request.user.email not in ADMINS:
            fields["counterparties"] = None
        return Response(fields)


class TemplateDetail(generics.RetrieveUpdateAPIView):
    queryset = models.ContractTemplate.objects.select_related("service", "creator", "creator__id")
    serializer_class = TemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.TemplatesFilter]


class TemplateList(generics.ListCreateAPIView):
    queryset = models.ContractTemplate.objects.select_related("service").order_by("pk")
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.TemplatesFilter]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TemplateSerializer
        return TemplateBaseSerializer


class AdminCounterpartyDetail(generics.RetrieveAPIView):
    serializer_class = CounterpartySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return models.Counterparty.objects.get(id__email__in=ADMINS)


class CurrentCounterpartyDetail(generics.RetrieveUpdateAPIView):
    serializer_class = CounterpartySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.counterparty


class CounterpartyDetail(generics.RetrieveUpdateAPIView):
    serializer_class = CounterpartySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class CounterpartyList(generics.ListAPIView):
    """Lists all counterparties for admin except himself,
    Lists two counterparties for regular user, his data and ours"""
    queryset = models.Counterparty.objects.select_related("id").order_by("pk")
    serializer_class = CounterpartySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.CounterpartiesFilter]


class ServicesList(generics.ListCreateAPIView):
    queryset = models.ServicesReference.objects.all().order_by("pk")
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, IsAdminCreating]

from django.contrib.auth import aauthenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from django.db import IntegrityError

from . import filters
from . import models
from .serializers import *
from .services import *
from .config import *


class ContractDetail(APIView):
    """Retrieve or update a contract instance."""

    def get(self, request, pk, format=None):
        user = request.user
        contract = models.Contract.objects.select_related("counterparty", "template", "template__service").get(pk=pk)
        if user.email not in ADMINS and contract.counterparty != user.counterparty:
            return Response(CONTRACT_DOES_NOT_EXIST, status=status.HTTP_404_NOT_FOUND)

        serializer = ContractDetailSerializer(contract)
        return Response({
            "is_admin": request.user.email in ADMINS,
            **serializer.data,
        })

    def patch(self, request, pk, format=None):
        user = request.user
        contract = models.Contract.objects.get(pk=pk)
        if user.email not in ADMINS and contract.counterparty != user.counterparty:
            return Response(CONTRACT_DOES_NOT_EXIST, status=status.HTTP_404_NOT_FOUND)

        serializer = ContractDetailSerializer(contract,
                                              data=request.data,
                                              context={'request': request},
                                              partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
            except Exception as e:
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
            return Response()
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class ContractListV2(generics.ListCreateAPIView):
    queryset = models.Contract.objects.all().select_related("counterparty", "template")
    serializer_class = ContractDetailSerializer
    filter_backends = [filters.contractsFilter]
    ordering = ["pk"]


class ContractList(APIView):
    """List all contracts, or create a new contract"""
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        q = models.Contract.objects.all().select_related("counterparty", "template").order_by("pk")
        if request.user.email in ADMINS:
            contracts = q
        else:
            contracts = q.filter(counterparty__pk=request.user.id)
        serializer = ContractBaseSerializer(contracts, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        """
        Creates new contract with counterparty
        if counterparty isn't specified
        contract will be created with admin

        name: str
        counterparty: id контрагента или null
        template: id шаблона
        contract: JSON | None

        Если был передан контракт то сохраняется в БД без формирования
        """
        serializer = ContractDetailSerializer(data=request.data,
                                              context={"request": request},
                                              partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            if instance.created:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            if request.user.email in ADMINS:
                return Response(CONTRACT_EXIST_ADMIN, status=status.HTTP_409_CONFLICT)
            return Response(CONTRACT_EXIST, status=status.HTTP_409_CONFLICT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Template(APIView):
    """Retrieve or update a template instance."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        user = request.user
        template = ContractTemplate.objects.select_related("service", "creator", "creator__id").get(pk=pk)
        serializer = TemplateSerializer(template, context={'user': user})
        return Response({
            "is_admin": user.email in ADMINS,
            "data": serializer.data
        })

    def patch(self, request, pk, format=None):
        template = ContractTemplate.objects.get(pk=pk)
        serializer = TemplateSerializer(template,
                                        data={"template": request.data},
                                        context={'request': request},
                                        partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
            except Exception as e:
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
            return Response()
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class TemplateDetail(generics.RetrieveUpdateAPIView):
    queryset = ContractTemplate.objects.select_related("service", "creator", "creator__id").all()
    permission_classes = [IsAuthenticated]


class TemplateList(generics.ListCreateAPIView):
    queryset = ContractTemplate.objects.all().select_related("service").order_by("pk")
    filter_backends = [filters.templatesFilter]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TemplateSerializer
        return TemplateBaseSerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, args, kwargs)
        response.data["is_admin"] = request.user.email in ADMINS
        response.data["data"] = response.data.pop("results")
        return response


class CounterpartiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # TODO: Тут можно сократить до 2 db hits
        if request.user.email not in ADMINS:
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = Counterparty.objects.select_related("id").all().exclude(id__email__in=ADMINS).order_by("pk")
        serializer = CounterpartySerializer(data, many=True)
        return Response(serializer.data)

    def patch(self, request, format=None):
        # TODO: Тут можно сократить до 3 db hits
        counterparty = request.user.counterparty
        serializer = CounterpartySerializer(counterparty, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
            except IntegrityError:
                return Response({"message": "Данная почта уже занята"},
                                status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Данные успешно изменены"})
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class CounterpartyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        # TODO: Тут можно сократить до 2 db hits
        serializer = CounterpartySerializer(user.counterparty, context={"email": user.email})
        return Response(serializer.data)


class Services(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        services = ServicesReference.objects.all().order_by("pk")
        serializer = ServiceSerializer(services, many=True)
        return Response({
            "is_admin": request.user.email in ADMINS,
            "data": serializer.data
        })

    def post(self, request, format=None):
        if request.user.email not in ADMINS:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            if instance.created:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(SERVICE_EXIST, status=status.HTTP_409_CONFLICT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContractFields(APIView):
    """
    Возвращает элементы из которых происходит выбор нужных для нового договора,
    а это контрагенты, шаблоны и услуги. Заказчикам контрагенты не отсылаются.

    За тем чтобы выбранный шаблон соответствовал услуге смотрит программа-клиент
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        fields = get_fields()
        if request.user.email not in ADMINS:
            fields["counterparties"] = None

        return Response({
            "is_admin": request.user.email in ADMINS,
            "data": fields,
        })


class ContractPreview(APIView):
    """
    Creates contract's preview to review it
    before actually saving it to database

    Returns contract and data that comes with it.
    Also includes user data to insert it in editor into contract
    So client don't need to request it again (saves time)
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = ContractDetailSerializer(data=request.data,
                                              context={"request": request},
                                              partial=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

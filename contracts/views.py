from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from django.db import IntegrityError

from . import models
from .serializers import *
from .services import *
from .config import *


class ContractDetail(APIView):
    """Retrieve or update a contract instance."""

    def get(self, request, pk, format=None):
        user = request.user
        contract = Contract.objects.get(pk=pk)
        if user.email not in ADMINS and contract.counterparty != user.counterparty:
            return Response(CONTRACT_DOES_NOT_EXIST, status=status.HTTP_400_BAD_REQUEST)

        serializer = ContractDetailSerializer(contract)
        return Response({
            "is_admin": request.user.email in ADMINS,
            **serializer.data,
        })

    def patch(self, request, pk, format=None):
        contract = Contract.objects.get(pk=pk)
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


class ContractList(APIView):
    '''List all contracts, or create a new contract'''
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        id = request.user.id
        if request.user.email in ADMINS:
            contracts = models.Contract.objects.all().order_by("pk")
        else:
            contracts = models.Contract.objects.all().order_by("pk").filter(counterparty__pk=id)
        serializer = ContractBaseSerializer(contracts, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        """
        Creates new contract with counterparty
        if counterparty isn't specified
        contract will be created with admin
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
        template = ContractTemplate.objects.get(pk=pk)
        serializer = TemplateSerializer(template, context={'request': request})
        return Response({
            "is_admin": request.user.email in ADMINS,
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
        print(serializer.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class Templates(APIView):
    """List all templates or create new template"""
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        templates = ContractTemplate.objects.all().order_by("pk")
        serializer = TemplateBaseSerializer(templates, many=True)
        return Response({
            "is_admin": request.user.email in ADMINS,
            "data": serializer.data
        })

    def post(self, request, format=None):
        serializer = TemplateSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            instance = serializer.save(creator=request.user.counterparty)
            if instance.created:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(TEMPLATE_EXIST, status=status.HTTP_409_CONFLICT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CounterpartiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        if request.user.email not in ADMINS:
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = Counterparty.objects.all().exclude(id__email__in=ADMINS).order_by("pk")
        serializer = CounterpartySerializer(data, many=True)
        return Response(serializer.data)

    def patch(self, request, format=None):
        c = Counterparty.objects.get(pk=request.user.id)
        serializer = CounterpartySerializer(c, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
            except IntegrityError:
                return Response({"message": "Данная почта уже занята"},
                                status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Данные успешно изменены"}, status=200)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class CounterpartyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        c = Counterparty.objects.get(pk=request.user.id)
        serializer = CounterpartySerializer(c, context={"email": request.user.email})
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
        print(request.data)
        serializer = ContractDetailSerializer(data=request.data,
                                              context={"request": request},
                                              partial=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContractSave(APIView):
    """
    Сохраняет в БД новый контракт без формирования его из шаблона,
    тем не менее все так же должны быть переданы поля:

    name: str
    counterparty: id контрагента или null
    template: id шаблона
    contract: JSON
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
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

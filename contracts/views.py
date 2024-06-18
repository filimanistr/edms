from django.http import JsonResponse, HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import IntegrityError

from .serializers import *
from .models import Counterparty
from .services import *


class Contract(APIView):
    """Retrieve, update or delete a contract instance."""
    permission_classes = [IsAuthenticated]

    def get(self, request, contract_id):
        r = get_contract(contract_id)
        if request.user.email in ADMINS:
            r["role"] = "admin"
        else:
            r["role"] = "user"

        return Response(r)

    def patch(self, request, contract_id):
        """Варианта 2: обновление статуса клиентом
                       обновление статуса сервером
                       выбран последний"""
        email = request.user.email

        # Обновление контракта
        if "contract" in request.data:
            contract = request.data["contract"]
            update_contract(email, contract_id, contract)

        # Обновление статуса контракта
        if "status" in request.data:
            update_contract_status(email, contract_id)

        return HttpResponse(status=200)


class Contracts(APIView):
    """List all contracts, or create a new contract"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.email in ADMINS:
            print("[log] get: contracts admin")
            r = get_all_contracts()
        else:
            print("[log] get: contracts user")
            user_id = request.user.id
            r = get_user_contracts(user_id)
        return JsonResponse(r, safe=False)

    def post(self, request):
        """Creates new contract, sets all the fields"""
        email = request.user.email
        c = request.data["counterparty"]
        s = request.data["service"]
        t = request.data["template"]
        n = request.data["name"]

        if email not in ADMINS:
            c = request.user.id

        contract = create_new_contract(user=email,
                                       counterparty_id=c,
                                       service_id=s,
                                       template_id=t,
                                       name=n)

        if contract is None:
            if email in ADMINS:
                msg = "Договор с таким именем для этого контрагента уже существует"
            else:
                msg = "Договор с таким именем уже существует"
            return Response({
                "success": False,
                "title": msg,
                "description": "Измените название договора"
                }, status=status.HTTP_409_CONFLICT)

        return JsonResponse(contract, safe=False)


class Template(APIView):
    """Retrieve, update or delete a template instance."""
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id):
        r = dict()
        r["is_admin"] = request.user.email in ADMINS
        r["data"] = get_template(template_id, request.user.id)
        return JsonResponse(r, safe=False)

    def patch(self, request, template_id):
        update_template(template_id, request.data)
        return HttpResponse(status=200)


class Templates(APIView):
    """List all templates or create new template"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        r = dict()
        r["is_admin"] = request.user.email in ADMINS
        r["data"] = get_contract_templates()
        return JsonResponse(r, safe=False)

    def post(self, request):
        template = request.data['template']
        service_id = request.data["service"]
        name = request.data["name"]
        template = create_new_template(name, service_id, template, request.user.id)

        # TODO: Куда то бы вынести все эти сообщения в файл отдельный,
        if template is None:
            return Response({
                "success": False,
                "title": "Шаблон с таким именем уже существует для данной услуги",
                "description": "Измените название шаблона или выберите другую услугу"
                }, status=status.HTTP_409_CONFLICT)

        return JsonResponse(template, safe=False)


class CounterpartiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.email in ADMINS:
            r = get_all_counterparties()
            return JsonResponse(r, safe=False)
        return HttpResponse(status=403)

    def patch(self, request):        
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

    def get(self, request):
        c = Counterparty.objects.get(pk=request.user.id)
        serializer = CounterpartySerializer(c, context={"email": request.user.email})
        return Response(serializer.data)


class Services(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        r = dict()
        r["is_admin"] = request.user.email in ADMINS
        r["data"] = get_services()
        return JsonResponse(r, safe=False)

    def post(self, request):
        if request.user.email not in ADMINS:
            return Response(status=status.HTTP_403_FORBIDDEN)

        r = create_new_service(request.data["name"],
                               request.data["price"],
                               request.data["year"])

        if r is None:
            return Response({
                "success": False,
                "title": "Услуга с таким именем уже существует",
                "description": "Измените название услуги на уникальное"
                }, status=status.HTTP_409_CONFLICT)

        return JsonResponse(r, safe=False)


class ContractFields(APIView):
    """Возвращает поля необходимые для создания контракта"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        r = dict()
        r["is_admin"] = request.user.email in ADMINS
        r["data"] = get_fields()
        if request.user.email not in ADMINS:
            r["data"]["counterparties"] = None
        return JsonResponse(r, safe=False)


class ContractPreview(APIView):
    """Creates contract's preview to review it
    before actually saving it to database"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        c = request.data["counterparty"]
        s = request.data["service"]
        t = request.data["template"]
        n = request.data["name"]

        # if user is not admin counterparty field would be empty,
        # so we take current user id to create contract for him
        email = request.user.email
        if email not in ADMINS:
            c = request.user.id

        return Response(create_contract_preview(
            counterparty_id=c,
            service_id=s,
            template_id=t,
            name=n
        ))


class ContractSave(APIView):
    """Saves to db new contract without generating it based on a template
    but should be specified anyway"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.user.email
        con = request.data["contract"]
        c = request.data["counterparty"]
        s = request.data["service"]
        t = request.data["template"]
        n = request.data["name"]

        if email not in ADMINS:
            c = request.user.id

        contract = save_contract_preview(user=email,
                                         contract=con,
                                         counterparty_id=c,
                                         service_id=s,
                                         template_id=t,
                                         name=n)

        if contract is None:
            if email in ADMINS:
                msg = "Договор с таким именем для этого контрагента уже существует"
            else:
                msg = "Договор с таким именем уже существует"
            return Response({
                "success": False,
                "title": msg,
                "description": "Измените название договора"
                }, status=status.HTTP_409_CONFLICT)
        return JsonResponse(contract, safe=False)


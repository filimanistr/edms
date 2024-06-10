from django.http import JsonResponse, HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .services import *

# TODO: Тут нужны drf generic base classes 


class Contract(APIView):
    """Retrieve, update or delete a contract instance."""
    permission_classes = [IsAuthenticated]

    def get(self, request, contract_id, format=None):
        r = get_contract(contract_id)
        if request.user.email in ADMINS:
            r["role"] = "admin"
        else:
            r["role"] = "user"

        return JsonResponse(r)

    def patch(self, request, contract_id, format=None):
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

    def get(self, request, template_id, format=None):
        r = dict()
        r["is_admin"] = request.user.email in ADMINS
        r["data"] = get_template(template_id)
        return JsonResponse(r, safe=False)

    def patch(self, request, template_id, format=None):
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
        if request.user.email in ADMINS:
            template = request.data['template']
            service_id = request.data["service"]
            name = request.data["name"]
            template = create_new_template(name, service_id, template)

            # TODO: Куда то бы вынести все эти сообщения в файлик отдельный,
            if template is None:
                return Response({
                    "success": False,
                    "title": "Шаблон с таким именем уже существует для данной услуги",
                    "description": "Измените название шаблона или выберите другую услугу"
                    }, status=status.HTTP_409_CONFLICT)

            return JsonResponse(template, safe=False)
        return HttpResponse(status=403)


class Counterparties(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.email in ADMINS:
            r = get_all_counterparties()
            return JsonResponse(r, safe=False)
        return HttpResponse(status=403)

    def post(self, request):
        # TODO: Создание новых контрагентов от лица админа
        pass


class Counterparty(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, counterparty_id, format=None):
        if request.user.id == counterparty_id or request.user.email in ADMINS:
            r = get_counterparty_data(counterparty_id)
            return JsonResponse(r, safe=False)
        return HttpResponse(status=403)

    def post(self, request):
        pass


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
        email = request.user.email
        c = request.data["counterparty"]
        s = request.data["service"]
        t = request.data["template"]
        n = request.data["name"]

        if email not in ADMINS:
            c = request.user.id

        return Response(create_contract_preview(counterparty_id=c,
                                                service_id=s,
                                                template_id=t,
                                                name=n))


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


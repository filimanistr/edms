from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from .services import *

# TODO: Тут нужны drf generic base classes 


class Contract(APIView):
    """Retrieve, update or delete a contract instance."""
    permission_classes = [IsAuthenticated]

    def get(self, request, contract_id, format=None):
        r = get_contract(contract_id)
        return JsonResponse(r)

    def post(self, request, contract_id, format=None):
        """Обновляем файл договора после того как внесли правки"""
        file = request.FILES["file"]
        data = b''
        for chunk in file.chunks():
            data += chunk
        # html = to_html(data)
        email = request.user.email
        update_contract(request.POST, contract_id, data, email)
        return HttpResponse(status=200)

    def put(request):
        # FIXME: Это approve_contract
        """Обновляет статус контракта и возвращает новый

        Обновление статуса контракта а так же самого контракта
        """
        put = QueryDict(request.body)
        contract_id = put.get("contract")
        email = request.user.email
        status = update_contract_status(contract_id, email)
        return JsonResponse({"status": status})


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
        c = request.data["counterparty"]
        s = request.data["service"]
        t = request.data["template"]
        n = request.data["name"]
        contract = create_new_contract(counterparty_id=c,
                                       service_id=s,
                                       template_id=t,
                                       name=n)
        return JsonResponse(contract, safe=False)


class Template(APIView):
    """Retrieve, update or delete a template instance."""
    permission_classes = [IsAuthenticated]

    def get(self, request, template_id, format=None):
        r = get_template(template_id)
        return JsonResponse(r, safe=False)


class Templates(APIView):
    """List all templates"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.email in ADMINS:
            r = get_contract_templates()
            return JsonResponse(r, safe=False)


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


class Services(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.email in ADMINS:
            r = get_services()
            return JsonResponse(r, safe=False)

    def post(self, request):
        # TODO: Добавление новых сервисов 
        pass


class ContractFields(APIView):
    """Возвращает поля необходимые для создания контракта"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_fields()
        return JsonResponse(data, safe=False)


''' Uploading a file '''


class FileUploadAPIView(APIView):
    """Creating new template object"""
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data['file']
        service_id = request.data["service"]
        name = request.data["name"]
        template = create_new_template(name, service_id, file_obj)
        return JsonResponse(template, safe=False)



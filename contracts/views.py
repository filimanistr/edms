from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.views import APIView

from .services import *


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
        file = request.FILES["file"]
        data = b''
        for chunk in file.chunks():
            data += chunk

        print(data)
        return JsonResponse(200)
        '''
        # Save html to the database
        c = create_new_contract(request.POST, data)
        print(c)
        return JsonResponse(contract)
        '''


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


class Templates(APIView):
    """List all templates, or create a new one"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.email in ADMINS:
            r = get_contract_templates()
            return JsonResponse(r, safe=False)

    def post(self, request):
        # TODO: Добавление новых шаблонов 
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



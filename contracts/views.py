from django.http import JsonResponse, HttpResponse
from rest_framework.permissions import IsAuthenticated

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

    def put(self, request, contract_id, format=None):
        email = request.user.email
        update_contract(contract_id, request.data)
        return HttpResponse(status=200)

    '''
    def put(request):
        # TODO: Решить что то завтра по статусу
        #       кидать его в PUT не правильная тема чето
        """Sets contract's status"""
        put = QueryDict(request.body)
        contract_id = put.get("contract")
        email = request.user.email
        status = update_contract_status(contract_id, email)
        return JsonResponse({"status": status})
    '''


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

    def put(self, request, template_id, format=None):
        update_template(template_id, request.data)
        print("Обновляем шаблон")
        return HttpResponse(status=200)


class Templates(APIView):
    """List all templates or create new template"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.email in ADMINS:
            r = get_contract_templates()
            return JsonResponse(r, safe=False)

    def post(self, request):
        template = request.data['template']
        service_id = request.data["service"]
        name = request.data["name"]
        template = create_new_template(name, service_id, template)
        return JsonResponse(template, safe=False)


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


''' TODO: Откинуть вообще в другую ветку гита
class FileUploadAPIView(APIView):
    """Creating new template object"""
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data['file']
        service_id = request.data["service"]
        name = request.data["name"]
        template = create_new_template(name, service_id, file_obj)
        return JsonResponse(template, safe=False)
'''


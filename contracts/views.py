from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, QueryDict
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from asgiref.sync import sync_to_async 
import io

from .forms import UploadFileForm
from .config import ADMINS, ZAMZAR_API_KEY
from .services import *


@login_required
def index(request):
    return render(request, 'index.html', context={
        "username":request.user.username,
        "admin": request.user.username in ADMINS,
    })


@login_required
def is_admin(request):
    return JsonResponse({
        "username": request.user.username,
        "is_admin": request.user.username in ADMINS,
    })

'''
async def to_html(data):
    """"Retrieves html of the doc from an API"""
    endpoint = "https://sandbox.zamzar.com/v1/jobs"
    file_content = {"source_file": data}
    data_content = {"target_format": "html5"}
    r = requests.post(endpoint, data=data_content, 
                                files=file_content, 
                                auth=HTTPBasicAuth(ZAMZAR_API_KEY, ''))
    return r.json()
'''

@login_required
@api_view(["GET", "PUT"])
def contract(request, contract_id):
    if request.method == "GET":
        r = get_contract(contract_id)
        return JsonResponse(r)

    if request.method == "PUT":
        """Обновляем файл договора после того как внесли правки"""
        file = request.FILES["file"]
        data = b''
        for chunk in file.chunks():
            data += chunk
        # html = to_html(data)
        username = request.user.username
        update_contract(request.POST, contract_id, data, username)
        return HttpResponse(status=200)

@login_required
def contracts(request):
    user_id = request.user.id
    if request.method == "GET":  # get contracts 
        if (request.user.username in ADMINS):
            r = get_all_contracts()
        else:
            r = get_user_contracts(user_id)
        return JsonResponse(r, safe=False)

    if request.method == "POST":  # create contract 
        # FIXME: сериализатор заюзать	
        file = request.FILES["file"]
        data = b''
        for chunk in file.chunks():
            data += chunk
        # Save html to the database
        contract = create_new_contract(request.POST, data)
        print(contract)
        return JsonResponse(contract)
    return HttpResponse(status=404)

@login_required
@api_view(["PUT"])
def approve_contract(request):
    """Обновляет статус контракта и возвращает новый"""
    put = QueryDict(request.body)
    contract_id = put.get("contract")
    username = request.user.username
    status = update_contract_status(contract_id, username)
    return JsonResponse({"status": status})


@login_required
def counterparties(request):
    if request.user.username in ADMINS:
        r = get_all_counterparties()
        return JsonResponse(r, safe=False)
    return HttpResponse(status=401)

@login_required
def templates(request):
    if request.user.username in ADMINS:
        r = get_contract_templates()
        return JsonResponse(r, safe=False)
    return HttpResponse(status=401)


@login_required
def contract_fields(request):
    """Возвращает поля необходимые для создания контракта"""
    return JsonResponse({
        "counterparty": "Контрагент",
        "template": "Шаблон договора",
        "contract": "Договор",
    }, safe=False)


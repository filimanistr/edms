from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login

from dadata import Dadata

from contracts.models import Counterpartie
from .forms import NewCounterpartieForm, NewUserForm
from .config import WEB_REGISTRATION_FIELDS, DADATA_API_TOKEN, \
                    COUNTERPARTIE_MODEL_FIELDS, DADATA_SECRET_KEY

# Create your views here.

def fields(request):
    """Returns the fields that web form should have"""
    return JsonResponse(WEB_REGISTRATION_FIELDS, safe=False)

dadata = Dadata(DADATA_API_TOKEN, DADATA_SECRET_KEY)

def get_bank_info(BIC):
    """По БИК возвращает название банка и корр/счет"""
    bank_info = dadata.find_by_id("bank", str(BIC))
    ca = bank_info[0]["data"]["correspondent_account"]
    bn = bank_info[0]["value"]
    return {"bank_name": bn, "correspondent_account": ca}

def get_declined_fio(*fio):
    """Проскланяет имя на родительский падеж"""
    data = dict()
    result = dadata.clean("name", " ".join(fio))['result_genitive']
    data['head_pos_first_name'] = result[0]
    data['head_pos_last_name'] = result[1]
    data['head_pos_middle_name'] = result[2]
    return data

def get_additional_data(fields):
    """Из урезанной формы на фронте достает больше инфы для модели"""
    counterpartie_fields = dict()
    for field in COUNTERPARTIE_MODEL_FIELDS:
        counterpartie_fields[field] = fields.get(field)

    # FIXME: строка ниже + 25 строчка ошибка List index out of range из за неверного BIC
    bd = get_bank_info(counterpartie_fields["BIC"])
    nd = get_declined_fio(fields["head_first_name"], 
                          fields["head_last_name"], 
                          fields["head_middle_name"])
    counterpartie_fields.update(bd)
    counterpartie_fields.update(nd)
    return counterpartie_fields

def register(request):
    if request.method == 'POST':
        fields = request.POST.copy()
        fields = get_additional_data(fields)
        form = NewCounterpartieForm(fields)
        user_form = NewUserForm(request.POST)
        if not form.is_valid():
            return JsonResponse(form.errors.get_json_data(), safe=False)
        if not user_form.is_valid():
            return JsonResponse(user_form.errors.get_json_data(), safe=False)
        user = user_form.save()
        Counterpartie.objects.create(id=user, **fields)

        login(request, user)
        username = user_form.cleaned_data.get('username')
        messages.success(request, f'Создан аккаунт {username}!')
        return redirect('/contracts')
    return render(request, 'register.html')

def profile(request):
    pass


from django.utils import timezone
from django.http import QueryDict
from django.forms.models import model_to_dict
from django.db.models import Count, Max
from django.db.models import Subquery

import os, io
import base64

from .models import Contracts, ContractsHistory, \
        ContractTemplate, Counterpartie
from .config import CONTRACTS_PATH, ADMINS

# Тут описывается вся бизнес логика
# т.е. Model слой в паттерне MVC

# FIXME: О первых трех функциях: надо этот повторяющийся код как то вынести
#        в другую функцию, которая бы возвращала запрос, к которому уже 
#        применяются другие параметры как например filter user_id = 1

        # МБ в декоратор закинуть ЛОЛ

''' НЕТ
    Сунуть в объект Contracts который будет иметь методы
    что формируют запрос, на основе запроса в INIT этого класса

    МБ даже в сам Model класс этот эти методы засунуть

    Но сначала надо эту дб рефакторить
'''



def get_contract(contract_id: int) -> dict:
    q = Contracts.objects.select_related("counterpartie") \
        .select_related("template") \
        .get(id=contract_id)
    return model_to_dict(q)

def get_all_contracts() -> list:
    q = Contracts.objects.select_related("counterpartie") \
        .select_related("template") \
        .values("id", "counterpartie__short_name", "template__id", "template__name", "contract", "status", "year")
    return list(q)

def get_user_contracts(user_id: int) -> list:
    q = Contracts.objects.select_related("counterpartie") \
        .select_related("template") \
        .filter(counterpartie_id=user_id) \
        .values("id", "counterpartie__short_name", "template__id", "template__name", "contract", "status", "year")
    return list(q)


def create_new_contract(contract: QueryDict, data) -> dict:
    data = base64.b64encode(data).decode("utf-8")
    counterpartie = Counterpartie.objects.get(id=contract["counterpartie"])
    template = ContractTemplate.objects.get(id=contract["template"])
    q = Contracts.objects.create(
        counterpartie = counterpartie,
        template = template,
        contract = data,
        year = timezone.now().year,
        status = "ожидает согласования заказчиком"
    )

    r = model_to_dict(q)
    r["counterpartie__short_name"] = counterpartie.short_name
    r["template__name"] = template.name
    return r


# FIXME: Вынести в отдельные функции преобразование статусов
#        Вносение правок и согласование по разному влияют на статус

def update_contract(contract: QueryDict, contract_id, data, username: str) -> None:
    if username in ADMINS:
        status = "ожидает согласования заказчиком"
    else:
        status = "ожидает согласования поставщиком"

    try: 
        last = ContractsHistory.objects.annotate(Max('version')).get(contract_id=contract_id)
        version = last.version + 1
    except ContractsHistory.DoesNotExist:
        version = 1

    contract = Contracts.objects.get(id=contract_id)
    q = ContractsHistory.objects.create(
        contract_id = Contracts.objects.get(id=contract.id),
        contract = contract.contract,
        version = version,
        status = contract.status
    )

    contract.contract = data
    contract.status = status
    contract.save()


def update_contract_status(contract_id: int, username: str) -> str:
    """Обновляет статус контракта относительно того
    какой `username` обновляет его, и возвращает новый"""
    contract = Contracts.objects.get(id=contract_id)
    if (username in ADMINS) and (contract.status == "ожидает согласования поставщиком"):
        contract.status = "согласован"
    elif (username not in ADMINS) and (contract.status == "ожидает согласования заказчиком"):
        contract.status = "ожидает согласования поставщиком"
    else:
        return contract.status

    contract.save()
    return contract.status


def get_all_counterparties() -> list[dict]:
    r = Counterpartie.objects.all().values()
    return list(r)

def get_contract_templates() -> list[dict]:
    r = ContractTemplate.objects.all().values()
    return list(r)



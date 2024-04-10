from django.utils import timezone
from django.http import QueryDict
from django.forms.models import model_to_dict
from django.db.models import Max

import mammoth
# import aspose.words as aw
import base64
import io

from .models import Contract, ContractsHistory, ContractTemplate, Counterparty, ServicesReference
from .config import ADMINS

# Тут описывается вся бизнес логика
# т.е. Model слой в паттерне MVC


def get_all_contracts() -> list:
    q = Contract.objects.values("id",
                                "name",
                                "counterparty__name",
                                "template__id",
                                "template__name",
                                "status",
                                "year")
    return list(q)


def get_contract(contract_id: int) -> dict:
    q = Contract.objects.values("id",
                                "name",
                                "counterparty__id",
                                "counterparty__name",
                                "template__id",
                                "template__name",
                                "status",
                                "year").get(id=contract_id)
    return q


def get_user_contracts(user_id: int) -> list:
    q = Contract.objects.values("id",
                                "name",
                                "counterparty__name",
                                "template__id",
                                "template__name",
                                "contract",
                                "status",
                                "year").get(counterparty_id=user_id)
    return q


def create_new_contract(counterparty_id: int, service_id: int, template_id: int, name: str) -> dict:
    counterparty = Counterparty.objects.get(id=counterparty_id)
    service = ServicesReference.objects.get(id=service_id)
    template = ContractTemplate.objects.get(id=template_id)
    # TODO: Тут должно исправлять template и исправленный вставлять в контракт
    #       новый статус черновик
    q = Contract.objects.create(
        counterparty=counterparty,
        template=template,
        name=name,
        contract=template.template,
        year=timezone.now().year,
        status="черновик"
    )

    r = model_to_dict(q)
    r["counterparty__name"] = counterparty.name
    r["template__name"] = template.name
    return r



def create_new_template(name: str, service_id: int, file) -> dict:
    data = b''
    for chunk in file.chunks():
        data += chunk

    doc = mammoth.convert_to_html(io.BytesIO(data))

    # OPTIONAL
    # doc = aw.Document(io.BytesIO(data))
    # doc.save("Output.html")

    # TODO: Ловить возможные ошибки надо и в случае чего пробовать опциональный конвертер
    # TODO: Еще опциональный выбор: формирование HTML со стороны клиента 

    service = ServicesReference.objects.get(id=service_id)
    q = ContractTemplate.objects.create(
        name=name,
        template=doc.value,
        service=service
    )

    return model_to_dict(q)


def get_contract_templates() -> list[dict]:
    r = ContractTemplate.objects.values("id", "name", "service__name")
    return list(r)

def get_template(template_id: int) -> dict:
    r = ContractTemplate.objects.values("id",
                                        "name",
                                        "service__name").get(id=template_id)
    return r



# FIXME: Вынести в отдельные функции преобразование статусов
#        Внесение правок и согласование по разному влияют на статус

def update_contract(contract: QueryDict, contract_id, data, username: str) -> None:
    # FIXME
    if username in ADMINS:
        status = "ожидает согласования заказчиком"
    else:
        status = "ожидает согласования поставщиком"

    try: 
        last = ContractsHistory.objects.annotate(Max('version')).get(contract_id=contract_id)
        version = last.version + 1
    except ContractsHistory.DoesNotExist:
        version = 1

    contract = Contract.objects.get(id=contract_id)
    q = ContractsHistory.objects.create(
        contract_id=Contract.objects.get(id=contract.id),
        contract=contract.contract,
        version=version,
        status=contract.status
    )

    contract.contract = data
    contract.status = status
    contract.save()


def update_contract_status(contract_id: int, username: str) -> str:
    # FIXME
    """Обновляет статус контракта относительно того
    какой `username` обновляет его, и возвращает новый"""
    contract = Contract.objects.get(id=contract_id)
    if (username in ADMINS) and (contract.status == "ожидает согласования поставщиком"):
        contract.status = "согласован"
    elif (username not in ADMINS) and (contract.status == "ожидает согласования заказчиком"):
        contract.status = "ожидает согласования поставщиком"
    else:
        return contract.status

    contract.save()
    return contract.status


def get_all_counterparties() -> list[dict]:
    r = Counterparty.objects.all().values()
    return list(r)


def get_services() -> list[dict]:
    r = ServicesReference.objects.all().values()
    return list(r)


def get_fields() -> dict[list]:
    counterparties = Counterparty.objects.values("id", "name")
    services = ServicesReference.objects.values("id", "name")
    templates = ContractTemplate.objects.values("id", "name")

    return {
        "counterparties": list(counterparties),
        "services": list(services),
        "templates": list(templates)
    }



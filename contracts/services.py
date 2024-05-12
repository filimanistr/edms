from django.utils import timezone
from django.http import QueryDict
from django.forms.models import model_to_dict
from django.db.models import Max

from weasyprint import HTML, CSS

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
                                "contract",
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
                                "year").filter(counterparty__id=user_id)
    return list(q)


def create_new_contract(user: str,
                        counterparty_id: int,
                        service_id: int,
                        template_id: int,
                        name: str) -> dict:
    counterparty = Counterparty.objects.get(id=counterparty_id)
    service = ServicesReference.objects.get(id=service_id)
    template = ContractTemplate.objects.get(id=template_id)

    # TODO: Тут должно быть формирование договора

    if user in ADMINS:
        status = "ожидает согласования заказчиком"
    else:
        status = "ожидает согласования поставщиком"

    q = Contract.objects.create(
        counterparty=counterparty,
        template=template,
        name=name,
        contract=template.template,
        year=timezone.now().year,
        status=status
    )

    r = model_to_dict(q)
    r["counterparty__name"] = counterparty.name
    r["template__name"] = template.name
    return r


def create_new_template(name: str, service_id: int, template: str) -> dict:
    '''
    data = b''
    for chunk in file.chunks():
        data += chunk
    '''

    service = ServicesReference.objects.get(id=service_id)
    q = ContractTemplate.objects.create(
        name=name,
        template=template,
        service=service
    )

    return model_to_dict(q)


def get_contract_templates() -> list[dict]:
    r = ContractTemplate.objects.values("id", "name", "service__name")
    return list(r)


def get_template(template_id: int) -> dict:
    q = ContractTemplate.objects.values("id",
                                        "name",
                                        "template",
                                        "service__id",
                                        "service__name").get(pk=template_id)
    return q


def update_contract_status_by_the_client(user,
                                         contract_id: int,
                                         status: str,
                                         new_contract: list) -> None:
    """Статус прилетает с клиента и его мы выставляем"""
    """DEPRECATED"""
    contract = Contract.objects.get(pk=contract_id)
    allowed_statuses = ["согласован",
                        "ожидает согласования заказчиком",
                        'ожидает согласования поставщиком']

    if status not in allowed_statuses:
        return

    # ОС_ => ожидает согласования _
    # ловим конкретно внесение правок, это когда было ОС_ стало ОС_
    if status.rsplit(" ", 1)[0] == "ожидает согласования":
        if contract.status == "согласован":
            print("Попытка выставления ОС согласованному договору")
            return

        # елси статус контракта не "согласован" то значит он ОС
        if status == contract.status:
            print("Попытка выставления одного и того же статуса второй раз")
            return

        # новый статус == ОС и старый статус == ОС то есть обновление
        contract.contract = new_contract
        contract.status = status
        contract.save()
        return

    if contract.status == "согласован":
        return

    ''' FIXME: Версионирование
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
    '''


def update_template(template_id: int, data: list) -> None:
    template = ContractTemplate.objects.get(pk=template_id)
    template.template = data
    template.save()


def update_contract_status(username: str, contract_id: int) -> None:
    contract = Contract.objects.get(pk=contract_id)
    if (username in ADMINS) and (contract.status == "ожидает согласования поставщиком"):
        contract.status = "согласован"
    elif (username not in ADMINS) and (contract.status == "ожидает согласования заказчиком"):
        contract.status = "согласован"
    else:
        print("попытка согласования согласованного договора")
        print("или согласования договора лицом, не имеющем на это привелегии")
        return

    contract.save()

def update_contract(user: str, contract_id: int, new_contract: list) -> None:
    contract = Contract.objects.get(pk=contract_id)
    if contract.status == "ожидает согласования поставщиком":
        status = "ожидает согласования заказчиком"
    elif contract.status == "ожидает согласования заказчиком":
        status = "ожидает согласования поставщиком"
    elif contract.status == "согласован":
        print("попытка изменения согласованного контракта")
        return

    contract.contract = new_contract
    contract.status = status
    contract.save()


def get_all_counterparties() -> list[dict]:
    r = Counterparty.objects.all().values()
    return list(r)


def get_services() -> list[dict]:
    r = ServicesReference.objects.all().values()
    return list(r)


def get_fields() -> dict:
    """Возвращает элементы из которых надо выбрать нужные для нового договора

    Шаблоны должны соответствовать их услугам"""
    # TODO: Обернуть в транзакцию
    counterparties = Counterparty.objects.values("id", "name")
    services = ServicesReference.objects.values("id", "name")
    templates = ContractTemplate.objects.values("id", "name", "service")

    return {
        "counterparties": list(counterparties),
        "services": list(services),
        "templates": list(templates)
    }


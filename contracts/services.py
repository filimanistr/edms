from django.utils import timezone
from django.http import QueryDict
from django.forms.models import model_to_dict
from django.db.models import Max

from weasyprint import HTML, CSS

from .models import Contract, ContractsHistory, ContractTemplate, Counterparty, ServicesReference
from .config import ADMINS, KEY_FIELDS

# Тут описывается вся бизнес логика
# т.е. Model слой в паттерне MVC

# TODO: Растолкать все по отдельным файлам contract_services скажем
#       но после рефакторинга всего вот этого вот, может у DRF что круче есть

def get_all_contracts() -> list:
    q = Contract.objects.values("id",
                                "name",
                                "counterparty__name",
                                "template__id",
                                "template__name",
                                "status",
                                "year")
    return list(q.order_by("id"))


def get_contract(contract_id: int) -> dict:
    q = Contract.objects.values("id",
                                "name",
                                "contract",
                                "counterparty__id",
                                "counterparty__name",
                                "template__id",
                                "template__name",
                                "template__service__name",
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
    return list(q.order_by("id"))


def form_contract(counterparty: Counterparty,
                  contract: Contract,
                  service: ServicesReference) -> dict:
    """Creating contracts based of a template"""
    data = contract.contract
    for leaf in data:
        for node in leaf["children"]:
            backgroundColor = node.get("backgroundColor")
            text = node["text"].lower().strip()
            if backgroundColor == "#FEFF00":
                if text == "название услуги":
                    node["text"] = str(service.name)
                    node["backgroundColor"] = ""
                elif text == "номер договора":
                    node["text"] = str(contract.name)
                    node["backgroundColor"] = ""
                elif text in KEY_FIELDS.keys():
                    node["text"] = str(getattr(counterparty, KEY_FIELDS[text]))
                    node["backgroundColor"] = ""

    return data


def create_new_contract(user: str,
                        counterparty_id: int,
                        service_id: int,
                        template_id: int,
                        name: str) -> dict:
    counterparty = Counterparty.objects.get(id=counterparty_id)
    service = ServicesReference.objects.get(id=service_id)
    template = ContractTemplate.objects.get(id=template_id)
    if user in ADMINS:
        status = "ожидает согласования заказчиком"
    else:
        status = "ожидает согласования поставщиком"

    # don't create contracts with same name for one counterparty
    obj, created = Contract.objects.get_or_create(
        name=name,
        counterparty=counterparty,
        defaults={
            "template": template,
            "contract": template.template,
            "year": timezone.now().year,
            "status": status
        }
    )

    # TODO: вот тут бы свою ошибку сделать
    if not created: return None
    data = form_contract(counterparty, obj, service)
    obj.contract = data
    obj.save()

    r = model_to_dict(obj)
    r["counterparty__name"] = counterparty.name
    r["template__name"] = template.name
    return r


def create_new_template(name: str, service_id: int, template: str) -> dict:
    service = ServicesReference.objects.get(id=service_id)

    # don't create template with same name for one service
    obj, created = ContractTemplate.objects.get_or_create(
        name=name,
        service=service,
        defaults={
            "template":template
        }
    )

    if not created: return None
    return model_to_dict(obj)


def get_contract_templates() -> list[dict]:
    r = ContractTemplate.objects.values("id", "name", "service__name")
    return list(r.order_by("id"))


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

        # если статус контракта не "согласован" то значит он ОС
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
    ContractTemplate.objects.filter(pk=template_id).update(template=data)


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
    return list(r.order_by("id"))

def get_counterparty_data(counterparty_id: int) -> list[dict]:
    r = Counterparty.objects.get(pk=counterparty_id)
    return model_to_dict(r)


def get_services() -> list[dict]:
    r = ServicesReference.objects.all().values()
    return list(r.order_by("id"))


def create_new_service(name: str, price: int, year) -> None:
    # TODO: Изучить тему по лучше, помню где то писали как сделать это правильно
    #       над еще копейки считать 
    obj, created = ServicesReference.objects.get_or_create(
        name=name,
        defaults={
            "price":price,
            "year":year
        }
    )

    if not created: return None
    return model_to_dict(obj)


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


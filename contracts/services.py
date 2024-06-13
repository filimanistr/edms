from django.utils import timezone
from django.forms.models import model_to_dict

from .models import Contract, ContractTemplate, Counterparty, ServicesReference
from .config import ADMINS, COUNTERPARTY_KEY_FIELDS, CONTRACT_KEY_FIELDS

# Тут описывается вся бизнес логика
# т.е. Model слой в паттерне MVC

# TODO: Растолкать все по отдельным файлам contract_services скажем
#       но после рефакторинга всего вот этого вот, может у DRF что круче есть


def get_all_contracts() -> list:
    q = Contract.objects.values("id",
                                "name",
                                "counterparty__id",
                                "counterparty__name",
                                "template__id",
                                "template__name",
                                "status",
                                "year")
    return list(q.order_by("pk"))


def get_contract(contract_id: int) -> dict:
    """Returns contract with `user` and `admin` data being passed in `key` field,
    these fields is being used to insert it fast to contract

    Maybe the better option would be to create separate endpoint to provide `key fields`,
    but for now this approach looks better because we don't have to request data
    multiple times to the server"""
    admin_data = Counterparty.objects.get(id__email__in=ADMINS)
    q = Contract.objects.get(pk=contract_id)
    keys = get_key_fields(q.name,
                          q.template.service,
                          q.counterparty,
                          admin_data)
    return {
        "id": q.id,
        "name": q.name,
        "contract": q.contract,
        "counterparty__id": q.counterparty.id_id,
        "counterparty__name": q.counterparty.name,
        "template__id": q.template.id,
        "template__name": q.template.name,
        "template__service__name": q.template.service.name,
        "status": q.status,
        "year": q.year,
        "keys": keys
    }


def get_user_contracts(user_id: int) -> list:
    q = Contract.objects.values("id",
                                "name",
                                "counterparty__id",
                                "counterparty__name",
                                "template__id",
                                "template__name",
                                "contract",
                                "status",
                                "year").filter(counterparty__id=user_id)
    return list(q.order_by("pk"))


def get_key_fields(contract_name: str,
                   service: ServicesReference,
                   user_data: Counterparty,
                   admin_data: Counterparty) -> dict:
    """Collects dict of key fields for contract forming"""
    return {
        "contract__name": contract_name,
        "service__name": service.name,
        "service__price": str(service.price),
        "service__year": str(service.year),
        "исп": model_to_dict(admin_data),
        "зак": model_to_dict(user_data)
    }


def form_contract(template: dict, data: dict) -> dict:
    """Creates contract from a template by inserting `data` to it"""

    def replace_text(node):
        if isinstance(node, dict):
            for key, value in node.items():
                if key == 'text' and node.get("backgroundColor") == "#FEFF00":
                    text = value.lower().strip()
                    if text in CONTRACT_KEY_FIELDS.keys():
                        node["text"] = str(data[CONTRACT_KEY_FIELDS[text]])
                        node["backgroundColor"] = ""
                        continue

                    field = text.rsplit(' ', 1)[0]
                    if field in COUNTERPARTY_KEY_FIELDS.keys():
                        prefix = text.split()[-1]
                        node["text"] = str(data[prefix][COUNTERPARTY_KEY_FIELDS[field]])
                        node["backgroundColor"] = ""
                else:
                    replace_text(value)
        elif isinstance(node, list):
            for item in node:
                replace_text(item)

    for leaf in template:
        replace_text(leaf)
    return template


def create_new_contract(user: str,
                        counterparty_id: int,
                        service_id: int,
                        template_id: int,
                        name: str) -> dict:
    counterparty = Counterparty.objects.get(pk=counterparty_id)
    admin_counterparty = Counterparty.objects.get(id__email__in=ADMINS)

    service = ServicesReference.objects.get(pk=service_id)
    template = ContractTemplate.objects.get(pk=template_id)
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
    data = get_key_fields(name, service, counterparty, admin_counterparty)
    contract = form_contract(obj.contract, data)
    obj.contract = contract
    obj.save()

    r = model_to_dict(obj)
    r["keys"] = data
    return r


def create_contract_preview(counterparty_id: int,  # should always be user id, not admin
                            service_id: int,
                            template_id: int,
                            name) -> dict:
    """Creates contract but not saves to database

    Returns contract and data that comes with it.
    Also includes user data to insert it in editor into contract
    So client don't need to request it again (saves time)"""
    counterparty = Counterparty.objects.get(pk=counterparty_id)
    admin_counterparty = Counterparty.objects.get(id__email__in=ADMINS)

    service = ServicesReference.objects.get(pk=service_id)
    template = ContractTemplate.objects.get(pk=template_id)

    data = get_key_fields(name, service, counterparty, admin_counterparty)
    preview = form_contract(template.template, data)

    return {
        "name": name,
        "template__name": template.name,
        "service__name": service.name,
        "contract": preview,
        "keys": data
    }


def save_contract_preview(user: str,
                          contract: list,
                          counterparty_id: int,
                          service_id: int,
                          template_id: int,
                          name: str) -> dict:
    """Save contract to db without forming it based on a template"""
    counterparty = Counterparty.objects.get(pk=counterparty_id)
    template = ContractTemplate.objects.get(pk=template_id)
    if user in ADMINS:
        status = "ожидает согласования заказчиком"
    else:
        status = "ожидает согласования поставщиком"

    # TODO: fix repeating code

    # don't create contracts with same name for one counterparty
    obj, created = Contract.objects.get_or_create(
        name=name,
        counterparty=counterparty,
        defaults={
            "template": template,
            "contract": contract,
            "year": timezone.now().year,
            "status": status
        }
    )

    # TODO: вот тут бы свою ошибку сделать
    if not created: return None
    r = model_to_dict(obj)
    r["counterparty__name"] = counterparty.name
    r["template__name"] = template.name
    return r


def create_new_template(name: str, service_id: int, template: str, creator_id: int) -> dict:
    service = ServicesReference.objects.get(pk=service_id)
    creator = Counterparty.objects.get(pk=creator_id)

    # don't create template with same name for one service
    obj, created = ContractTemplate.objects.get_or_create(
        name=name,
        service=service,
        defaults={
            "creator": creator,
            "template": template
        }
    )

    if not created: return None
    return model_to_dict(obj)


def get_contract_templates() -> list[dict]:
    r = ContractTemplate.objects.values("id", "name", "service__name")
    return list(r.order_by("pk"))


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
    r = Counterparty.objects.all().exclude(id__email__in=ADMINS).values()
    return list(r.order_by("pk"))


def get_counterparty_data(counterparty_id: int) -> list[dict]:
    r = Counterparty.objects.get(pk=counterparty_id)
    return model_to_dict(r)


def get_services() -> list[dict]:
    r = ServicesReference.objects.all().values()
    return list(r.order_by("pk"))


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
    counterparties = Counterparty.objects.exclude(id__email__in=ADMINS).values("id", "name")
    services = ServicesReference.objects.values("id", "name")
    templates = ContractTemplate.objects.values("id", "name", "service")

    return {
        "counterparties": list(counterparties),
        "services": list(services),
        "templates": list(templates)
    }


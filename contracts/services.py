from django.utils import timezone
from django.forms.models import model_to_dict

import xml.etree.ElementTree as ET

from .models import Contract, ContractTemplate, Counterparty, ServicesReference
from . import config

# Тут описывается вся бизнес логика
# т.е. Model слой в паттерне MVC

tree = ET.parse("bic.xml")
root = tree.getroot()


def get_bank_info(id):
    """По БИК возвращает название банка и корр/счет

    пока не понятно как часто надо обновлять инфу
    и что будет если она не окажется достоверной,
    TODO: надо либо обновлять каждый запрос сюда
          либо раз в месяц ок будет (не будет (хз))
          дописать обновление инфы надо"""
    data = root.find('{urn:cbr-ru:ed:v2.0}BICDirectoryEntry[@BIC="%s"]' % id)
    if data is None:
        return None

    name = data.find("{urn:cbr-ru:ed:v2.0}ParticipantInfo").attrib
    ca = data.find("{urn:cbr-ru:ed:v2.0}Accounts").attrib
    return {"bank_name": name["NameP"], "correspondent_account": ca["Account"]}


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
                    if text in config.CONTRACT_KEY_FIELDS.keys():
                        node["text"] = str(data[config.CONTRACT_KEY_FIELDS[text]])
                        node["backgroundColor"] = ""
                        continue

                    field = text.rsplit(' ', 1)[0]
                    if field in config.COUNTERPARTY_KEY_FIELDS.keys():
                        prefix = text.split()[-1]
                        node["text"] = str(data[prefix][config.COUNTERPARTY_KEY_FIELDS[field]])
                        node["backgroundColor"] = ""
                else:
                    replace_text(value)
        elif isinstance(node, list):
            for item in node:
                replace_text(item)

    for leaf in template:
        replace_text(leaf)
    return template


def update_status(status: str, is_admin: bool, changed: bool) -> str:
    """
    Возвращает новый статус для контракта, на основе существующего статуса,
    статуса пользователя изменившего контракт и статуса контракта

    строго необходимо размещать перед изменением контракта, т.к. эта
    функция отлавливает ошибки, при которых сохранение изменений не возможно

    :param status: Cтатус, который висит на контракте сейчас.
    :param is_admin: Является ли изменивший статус админом.
    :param changed: Был ли договор изменен
    """
    if status == "ожидает согласования поставщиком":
        if changed: return "ожидает согласования заказчиком"
        if is_admin: return "согласован"
        raise Exception(config.CANT_ACCEPT_BY_USER)
    elif status == "ожидает согласования заказчиком":
        if changed: return "ожидает согласования поставщиком"
        if not is_admin: return "согласован"
        raise Exception(config.CANT_ACCEPT_BY_ADMIN)
    elif status == "согласован":
        if changed: Exception(config.CANT_EDIT_ACCEPTED_CONTRACT)
        raise Exception(config.CANT_ACCEPT_ACCEPTED_CONTRACT)


def get_fields() -> dict:
    """
    Возвращает список всех контрагентов, шаблонов и услуг,
    необходимо на view слое отсекать counterparties из вывода этой функции для заказчиков
    """
    # TODO: Обернуть в транзакцию
    counterparties = Counterparty.objects.exclude(id__email__in=config.ADMINS).values("id", "name")
    services = ServicesReference.objects.values("id", "name")
    templates = ContractTemplate.objects.values("id", "name", "service")

    return {
        "counterparties": list(counterparties),
        "services": list(services),
        "templates": list(templates)
    }


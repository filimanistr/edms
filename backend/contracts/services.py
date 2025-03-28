from django.forms.models import model_to_dict

from dataclasses import dataclass
import xml.etree.ElementTree as ET

from .models import ContractTemplate, Counterparty, ServicesReference
from . import config

# Тут описывается вся бизнес логика
# т.е. Model слой в паттерне MVC

tree = ET.parse("bic.xml")
root = tree.getroot()


def get_bank_info(bic: str):
    """
    По БИК возвращает название банка и корр/счет

    пока не понятно как часто надо обновлять информацию
    и что будет если она не окажется достоверной,

    TODO: надо либо обновлять каждый запрос сюда
          либо раз в месяц ок будет (не будет (хз))
          дописать обновление информации надо
    """
    data = root.find('{urn:cbr-ru:ed:v2.0}BICDirectoryEntry[@BIC="%s"]' % bic)
    if data is None:
        return None

    name = data.find("{urn:cbr-ru:ed:v2.0}ParticipantInfo").attrib
    ca = data.find("{urn:cbr-ru:ed:v2.0}Accounts").attrib
    return {"bank_name": name["NameP"], "correspondent_account": ca["Account"]}


@dataclass
class Keys:
    """Forms contracts"""
    contract__name: str
    service__name: str
    service__price: str
    service__year: str
    contractor: Counterparty
    client: Counterparty


def form_contract(template: dict, data: Keys) -> dict:
    """Creates contract from a template by inserting `data` to it"""

    def replace_text(node):
        if isinstance(node, dict):
            for key, value in node.items():
                if key == 'text' and node.get("backgroundColor") == "#FEFF00":
                    text = value.lower().strip()
                    if text in config.CONTRACT_KEY_FIELDS.keys():
                        node["text"] = str(getattr(data, config.CONTRACT_KEY_FIELDS[text]))
                        node["backgroundColor"] = ""
                        continue

                    field = text.rsplit(' ', 1)[0]
                    if field in config.COUNTERPARTY_KEY_FIELDS.keys():
                        prefix = text.split()[-1]
                        node["text"] = str(getattr(getattr(data, prefix), config.COUNTERPARTY_KEY_FIELDS[field]))
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
    :param changed: Был ли договор изменен или только обновлен статус до согласованного
    """
    if status == config.ContractStatuses.WAITING_ADMIN:
        if not is_admin: raise Exception(config.CANT_EDIT_BY_USER)
        if changed: return config.ContractStatuses.WAITING_USER
        if is_admin: return config.ContractStatuses.ACCEPTED
    elif status == config.ContractStatuses.WAITING_USER:
        if is_admin: raise Exception(config.CANT_EDIT_BY_ADMIN)
        if changed: return config.ContractStatuses.WAITING_ADMIN
        if not is_admin: return config.ContractStatuses.ACCEPTED
    elif status == config.ContractStatuses.ACCEPTED:
        if changed: Exception(config.CANT_EDIT_ACCEPTED_CONTRACT)
        raise Exception(config.CANT_EDIT_ACCEPTED_CONTRACT)
    raise Exception("Unknown status")


def get_fields() -> dict:
    """
    Возвращает список всех контрагентов, шаблонов и услуг,
    необходимо на view слое отсекать counterparties из вывода этой функции для заказчиков
    """
    counterparties = Counterparty.objects.exclude(id__is_admin=True).values("id", "name")
    services = ServicesReference.objects.values("id", "name")
    templates = ContractTemplate.objects.values("id", "name", "service")

    return {
        "counterparties": list(counterparties),
        "services": list(services),
        "templates": list(templates)
    }

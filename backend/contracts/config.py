import os

# Messages
# to be returned to client

SERVICE_EXIST = {
    "success": False,
    "title": "Услуга с таким именем уже существует",
    "description": "Измените название услуги на уникальное",
}

TEMPLATE_EXIST = {
    "success": False,
    "title": "Шаблон с таким именем уже существует для данной услуги",
    "description": "Измените название шаблона или выберите другую услугу",
}

CONTRACT_EXIST = {
    "success": False,
    "title": "Договор с таким именем уже существует",
    "description": "Измените название договора",
}

CONTRACT_EXIST_ADMIN = {
    "success": False,
    "title": "Договор с таким именем уже существует для данного контрагента",
    "description": "Измените название договора",
}

CONTRACT_DOES_NOT_EXIST = {
    "success": False,
    "title": "Такого договора не существует",
    "description": "Вернитесь на главную страницу",
}

# to be returned to console inside

COUNTERPARTY_NOT_SELECTED = "Не был выбран заказчик с которым создается договор"

CANT_EDIT_ACCEPTED_CONTRACT = "Нельзя изменять существующий контракт"

CANT_ACCEPT_ACCEPTED_CONTRACT = "Нельзя согласовать согласованный договор"
CANT_ACCEPT_BY_USER = "Вы не можете согласовать этот договор, ожидает согласование поставщиком"
CANT_ACCEPT_BY_ADMIN = "Вы не можете согласовать этот договор, ожидает согласование заказчиком"

# Глобальные переменные


class ContractStatuses:
    WAITING_USER = "ожидает согласования заказчиком"
    WAITING_ADMIN = "ожидает согласование поставщиком"
    ACCEPTED = "согласован"


ADMINS = (os.getenv("EMAIL"), )

CONTRACT_KEY_FIELDS = {
    "название договора": "contract__name",
    "название услуги": "service__name",
    "стоимость услуги": "service__price",
    "год услуги": "service__year"
}

COUNTERPARTY_KEY_FIELDS = {
    'фамилия': 'head_last_name',
    'имя': 'head_first_name',
    'отчество': 'head_middle_name',
    'фамилия в род. пад.': 'head_pos_last_name',
    'имя в род. пад.': 'head_pos_first_name',
    'отчество в род. пад.': 'head_pos_middle_name',
    'наименование организации': 'full_name',
    'краткое наименование': 'name',
    'основания': 'reason',
    'инн': 'INN',
    'кпп': 'KPP',
    'наименование банка': 'bank_name',
    'бик банка': 'BIC',
    'корреспондентский счет': 'correspondent_account',
    'расчетный счет': 'checking_account',
    'лицевой счет': 'personal_account'
}



# Глобальные переменные

***REMOVED***

STATUSES = ["ожидает согласования заказчиком",
            "ожидает согласование поставщиком",
            "согласован"]

ADMINS = (
    "filimanistr@gmail.com",
    "0@gmail.com",
)


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


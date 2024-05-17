
# Глобальные переменные / константы

***REMOVED***

STATUSES = ["ожидает согласования заказчиком",
            "ожидает согласование поставщиком",
            "согласован"]

ADMINS = (
    "filimanistr@gmail.com",
)


KEY_FIELDS = {
    'номер договора': 'contract__name',
    'название услуги': 'service__name',
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
    'личный счет': 'personal_account'
}


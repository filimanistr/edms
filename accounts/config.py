
# https://dadata.ru/api/find-bank/#
***REMOVED***
***REMOVED***

ERROR_MESSAGES_TRANSLATIONS = {
    'invalid': 'Поле "Имя пользователя" должно содержать только английские буквы и символы @/./+/-/_ ',
    "password_too_common": "Пароль слишком легкий",
    "password_entirely_numeric": "Пароль не должен состоять только из цифр",
    "password_too_short": "Пароль слишком короткий, он должен состоять хотя бы из 8 цифр",
    "password_too_similar": "Пароль слишком похож на имя пользователя",
}

WEB_REGISTRATION_FIELDS = [
    {
        "head_first_name": "Имя",
        "head_last_name": "Фамилия",
        "head_middle_name": "Отчество",
        "username": "Имя пользователя",
        "password1": "Пароль",
        "password2": "Повторите пароль",
        "reason": "Основания",
    },
    {
        "short_name": "Короткое наименование организации",
        "full_name": "Полное наименование организации",
        "INN": "ИНН",
        "KPP": "КПП",
        "BIC": "БИК",
        "checking_account": "р/с",
        "personal_account": "л/с",
    }
]

COUNTERPARTIE_MODEL_FIELDS = [
    "short_name",
    "full_name",
    "INN",
    "KPP",
    "bank_name",
    "BIC",
    "correspondent_account",
    "checking_account",
    "personal_account",
    "head_first_name",
    "head_last_name",
    "head_middle_name",
    "head_pos_first_name",
    "head_pos_last_name",
    "head_pos_middle_name",
    "reason",
]

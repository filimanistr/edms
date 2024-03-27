from django.db import models
from django.contrib.auth.models import User

class Counterpartie(models.Model):
    id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    short_name = models.TextField("наименование краткое",
                                  db_column = "наименование_краткое")
    full_name = models.TextField("наименование полное",
                                 db_column = "наименование_полное")
    INN = models.DecimalField("ИНН", max_digits=12, decimal_places=0,
                              db_column = "ИНН")
    KPP = models.DecimalField("КПП", max_digits=9, decimal_places=0,
                              db_column = "КПП")

    # МБ стоило вынести в отдельную таблицу часть с банком
    bank_name = models.TextField("наименование банка",
                                 db_column = "наименование_банка")
    BIC = models.TextField("БИК", db_column = "БИК")
    correspondent_account = models.DecimalField("корр/счет",
                                                max_digits=20,
                                                decimal_places=0,
                                                db_column = "корр/счет")
    checking_account = models.DecimalField("р/с",
                                           max_digits=20,
                                           decimal_places=0,
                                           db_column = "р/с")
    personal_account = models.TextField("л/с", db_column = "л/с")

    # ФИО Руководителя и на основании чего действует руководитель
    head_first_name = models.TextField("имя", db_column = "имя")
    head_last_name = models.TextField("фамилия", db_column = "фамилия")
    head_middle_name = models.TextField("отчество", db_column = "отчество")
    head_pos_first_name = models.TextField("имяр", db_column = "имяр")
    head_pos_last_name = models.TextField("фамилияр", db_column = "фамилияр")
    head_pos_middle_name = models.TextField("отчествор", db_column = "отчествор")
    reason = models.TextField("На основании чего действует руководитель",
                              db_column = "основание")
    def __str__(self):
        return self.short_name

    class Meta:
        db_table = "Контрагент"


class ClosingDocumentsReference(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField("наименование", db_column = "наименование")
    type = models.TextField("тип", db_column = "тип")
    template = models.TextField("шаблон", db_column = "шаблон")

    class Meta:
        db_table = "СправочникТиповЗакрывающихДокументов"


class ServicesReference(models.Model):
    id = models.AutoField(primary_key=True)
    service_name = models.TextField("наименование услуги",
                                    db_column = "наименование_услуги")
    price = models.DecimalField("цена", max_digits = 14, decimal_places = 2,
                                db_column = "цена")
    year = models.IntegerField("год", db_column = "год")

    def __str__(self):
        return self.service_name

    class Meta:
        db_table = "СправочникУслуг"



class ContractTemplate(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField("наименование", db_column = "наименование")
    template = models.TextField("шаблон", db_column = "шаблон")
    service = models.ForeignKey(ServicesReference,
                                on_delete = models.CASCADE,
                                verbose_name = "услуга",
                                db_column = "услуга")
    def __str__(self):
        return self.name

    class Meta:
        db_table = "ШаблонДоговора"


class Contracts(models.Model):
    """Связывающая таблица Контрагента и Шаблонов договоров"""
    id = models.AutoField(primary_key=True)
    counterpartie = models.ForeignKey(Counterpartie,
                                      on_delete = models.CASCADE,
                                      verbose_name = "контрагент",
                                      db_column = "контрагент")
    template = models.ForeignKey(ContractTemplate,
                                 on_delete = models.CASCADE,
                                 verbose_name = "шаблон",
                                 db_column = "шаблон")
    contract = models.TextField("договор", db_column = "договор")
    year = models.IntegerField("год", db_column = "год")
    status = models.TextField("статус", db_column = "статус")

    def __str__(self):
        return self.counterpartie.short_name + " " + self.template.name

    class Meta:
        db_table = "Договора"

# Предполагает, что контрагент и шаблон не меняется
# Регистрация изменений только самого договора
class ContractsHistory(models.Model):
    id = models.AutoField(primary_key=True)
    contract_id = models.ForeignKey(Contracts,
                                    on_delete = models.CASCADE,
                                    verbose_name = "id договора", 
                                    db_column = "id_договора")
    contract = models.TextField("договор", db_column = "договор")
    version = models.IntegerField("версия", db_column = "версия")
    status = models.TextField("статус", db_column = "статус")

    class Meta:
        db_table = "ИсторияДоговоров"

class ClosingDocument(models.Model):
    id = models.AutoField(primary_key=True)
    num = models.TextField("номер", db_column = "номер")
    date = models.DateField("дата", db_column = "дата")
    document = models.TextField("документ", db_column="документ")
    type = models.ForeignKey(ClosingDocumentsReference,
                             on_delete = models.CASCADE,
                             verbose_name = "тип документа",
                             db_column = "тип_документа")
    service = models.ForeignKey(ServicesReference,
                                on_delete = models.CASCADE,
                                verbose_name = "услуга",
                                db_column = "услуга")
    contract = models.ForeignKey(Contracts,
                                 on_delete = models.CASCADE,
                                 verbose_name = "договор",
                                 db_column = "договор")
    class Meta:
        db_table = "ЗакрывающиеДокументы"


class Payments(models.Model):
    """Таблица с информацией о поступлении оплаты"""
    id = models.AutoField(primary_key=True)
    counterpartie = models.TextField("учреждение", db_column = "учреждение")
    reason = models.TextField("назначение платежа", db_column = "назначение_платежа")
    date = models.DateField("дата оплаты", db_column = "дата_оплаты")
    price = models.DecimalField("сумма оплаты",
                                max_digits = 10,
                                decimal_places = 2,
                                db_column = "сумма_оплаты")
    class Meta:
        db_table = "ПоступающиеОплаты"



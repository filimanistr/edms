from django.db import models
from django.contrib.auth import get_user_model


class Counterparty(models.Model):
    id = models.OneToOneField(get_user_model(),
                              on_delete=models.CASCADE,
                              primary_key=True)
    name = models.CharField("наименование краткое",
                            db_column="наименование_краткое",
                            max_length=150)
    full_name = models.CharField("наименование полное",
                                 db_column="наименование_полное",
                                 max_length=300)
    INN = models.CharField("ИНН", max_length=10, db_column="ИНН")
    KPP = models.CharField("КПП", max_length=9,db_column="КПП")

    # Банковская информация
    bank_name = models.CharField("наименование банка",
                                 max_length=50,
                                 db_column="наименование_банка")
    BIC = models.CharField("БИК", max_length=10, db_column="БИК")
    correspondent_account = models.CharField("корр/счет",
                                             max_length=20,
                                             db_column="корр/счет")
    checking_account = models.CharField("р/с", max_length=20, db_column="р/с")
    personal_account = models.CharField("л/с", max_length=20, db_column="л/с")

    # ФИО Руководителя и на основании чего действует руководитель
    head_first_name = models.CharField("имя", max_length=20, db_column="имя")
    head_last_name = models.CharField("фамилия", max_length=40, db_column="фамилия")
    head_middle_name = models.CharField("отчество", max_length=20,  db_column="отчество")
    head_pos_first_name = models.CharField("имяр", max_length=20, db_column="имяр")
    head_pos_last_name = models.CharField("фамилияр",max_length=40,  db_column="фамилияр")
    head_pos_middle_name = models.CharField("отчествор", max_length=20, db_column="отчествор")
    reason = models.CharField("На основании чего действует руководитель",
                              max_length=300,
                              db_column="основание")

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Контрагент"
        verbose_name = 'Контрагент'
        verbose_name_plural = 'Контрагенты'


class ClosingDocumentsReference(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField("наименование", max_length=200, db_column="наименование")
    type = models.CharField("тип", max_length=40, db_column="тип")
    template = models.JSONField("шаблон", db_column="шаблон")

    def __str__(self):
        return self.name

    class Meta:
        db_table = "СправочникТиповЗакрывающихДокументов"
        verbose_name = 'Тип закрывающего документы'
        verbose_name_plural = 'Типы закрывающих документов'


class ServicesReference(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField("наименование услуги",
                            db_column="наименование_услуги",
                            max_length=300)
    price = models.DecimalField("цена", max_digits=14, decimal_places=2,
                                db_column="цена")
    year = models.IntegerField("год", db_column="год")

    def __str__(self):
        return self.name

    class Meta:
        db_table = "СправочникУслуг"
        verbose_name = 'Услуга'
        verbose_name_plural = 'Справочник услуг'


class ContractTemplate(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField("наименование", max_length=200, db_column="наименование")
    template = models.JSONField("шаблон", db_column="шаблон")
    creator = models.ForeignKey(Counterparty,
                                on_delete=models.CASCADE,
                                verbose_name="автор",
                                db_column="автор")
    service = models.ForeignKey(ServicesReference,
                                on_delete=models.CASCADE,
                                verbose_name="услуга",
                                db_column="услуга")

    def __str__(self):
        return self.name

    class Meta:
        db_table = "ШаблонДоговора"
        verbose_name = 'Шаблон договора'
        verbose_name_plural = 'Шаблоны догворов'


class Contract(models.Model):
    """Связывающая таблица Контрагента и Шаблонов договоров"""
    id = models.AutoField(primary_key=True)
    name = models.CharField("наименование", max_length=200, db_column="наименование")
    counterparty = models.ForeignKey(Counterparty,
                                     on_delete=models.CASCADE,
                                     verbose_name="контрагент",
                                     db_column="контрагент")
    template = models.ForeignKey(ContractTemplate,
                                 on_delete=models.CASCADE,
                                 verbose_name="шаблон",
                                 db_column="шаблон")
    contract = models.JSONField("договор", db_column="договор")
    year = models.IntegerField("год", db_column="год")
    status = models.CharField("статус", max_length=32, db_column="статус")

    def __str__(self):
        return self.counterparty.name + " " + self.template.name

    class Meta:
        db_table = "Договора"
        verbose_name = 'Договор'
        verbose_name_plural = 'Договора'


# Предполагает, что контрагент и шаблон не меняется
# Регистрация изменений только самого договора
class ContractsHistory(models.Model):
    id = models.AutoField(primary_key=True)
    contract_id = models.ForeignKey(Contract,
                                    on_delete=models.CASCADE,
                                    verbose_name="id договора",
                                    db_column="id_договора")
    contract = models.JSONField("договор", db_column="договор")
    version = models.IntegerField("версия", db_column="версия")
    status = models.CharField("статус", max_length=32, db_column="статус")

    class Meta:
        db_table = "ИсторияДоговоров"
        verbose_name = 'История договора'
        verbose_name_plural = 'История договоров'


class ClosingDocument(models.Model):
    id = models.AutoField(primary_key=True)
    num = models.CharField("номер", max_length=20, db_column="номер")
    date = models.DateField("дата", db_column="дата")
    document = models.JSONField("документ", db_column="документ")
    type = models.ForeignKey(ClosingDocumentsReference,
                             on_delete=models.CASCADE,
                             verbose_name="тип документа",
                             db_column="тип_документа")
    service = models.ForeignKey(ServicesReference,
                                on_delete=models.CASCADE,
                                verbose_name="услуга",
                                db_column="услуга")
    contract = models.ForeignKey(Contract,
                                 on_delete=models.CASCADE,
                                 verbose_name="договор",
                                 db_column="договор")

    class Meta:
        db_table = "ЗакрывающиеДокументы"
        verbose_name = 'Закрывающий документ'
        verbose_name_plural = 'Закрывающие документы'


class Payments(models.Model):
    """Таблица с информацией о поступлении оплаты"""
    id = models.AutoField(primary_key=True)
    # TODO: Тут должна быть ссылка как бы, мда
    counterparty = models.TextField("учреждение", db_column="учреждение")
    reason = models.CharField("назначение платежа",
                              max_length=300,
                              db_column="назначение_платежа")
    date = models.DateField("дата оплаты", db_column="дата_оплаты")
    price = models.DecimalField("сумма оплаты",
                                max_digits=10,
                                decimal_places=2,
                                db_column="сумма_оплаты")

    class Meta:
        db_table = "ПоступающиеОплаты"
        verbose_name = 'Поступление оплаты'
        verbose_name_plural = 'Поступления оплаты'

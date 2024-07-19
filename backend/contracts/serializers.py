from rest_framework import serializers
from rest_framework.exceptions import APIException
from django.utils import timezone

from accounts.models import User
from .config import ADMINS, COUNTERPARTY_NOT_SELECTED, ContractStatuses, TEMPLATE_EXIST, CANT_EDIT_GENERAL_TEMPLATE
from .services import get_key_fields, form_contract, get_bank_info, update_status
from .exceptions import AlreadyExistsException, ForbiddenToEditException
from . import models


class CounterpartySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="id.email")
    password = serializers.CharField(write_only=True)

    FIELDS_TO_CHECK = {
        "head_first_name": "head_pos_first_name",
        "head_last_name": "head_pos_last_name",
        "head_middle_name": "head_pos_middle_name",
    }

    class Meta:
        model = models.Counterparty
        fields = "__all__"

    def validate(self, data):
        """
        Проверка на то был ли передан БИК и склонения ФИО с клиента

        TODO: На клиенте происходит склонение ФИО в род. падеж, а так как клиент
              сейчас один - сайт на js, то реализовать пока на сервере
              склонение (для других клиентов где нет js) нет смысла.
              На клиенте потому что попался инструмент хороший :)
        """

        for key, value in self.FIELDS_TO_CHECK.items():
            if key in data.keys() and value not in data.keys():
                # Тут преобразование в род. падеж, надо а ошибку убрать
                raise serializers.ValidationError("Ко мне не приходит ФИО в р.п. на клиенте ошибка")

        if data.get("BIC") is not None:
            bank_data = get_bank_info(data["BIC"])
            if bank_data is None:
                raise serializers.ValidationError("БИК банка не валиден")
            data.update(bank_data)

        return data

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data["id"]["email"], password=validated_data["password"])
        counterparty_data = {key: value for key, value in validated_data.items() if key not in ("id", "password")}
        return models.Counterparty.objects.create(id=user, **counterparty_data)

    def update(self, instance, validated_data):
        email = validated_data.get("id")
        if email is not None:
            instance.id.email = email["email"]
            instance.id.save()

        for field, value in validated_data.items():
            if field != "id":
                setattr(instance, field, value)

        instance.save()
        return instance


"""Templates"""


class TemplateBaseSerializer(serializers.ModelSerializer):
    service__name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = models.ContractTemplate
        fields = [
            "id",
            "name",
            "service__name",
            "service"
        ]

        # эти поля не возвращаем, но читаем
        extra_kwargs = {
            'service': {'write_only': True},
        }


class TemplateSerializer(TemplateBaseSerializer):
    """
    Включает более подробную информацию о конкретном шаблоне
    """
    editable = serializers.SerializerMethodField()
    service__id = serializers.IntegerField(source="service.id", read_only=True)

    class Meta:
        model = models.ContractTemplate
        fields = TemplateBaseSerializer.Meta.fields + ["template", "editable", "service__id"]
        extra_kwargs = TemplateBaseSerializer.Meta.extra_kwargs

    def get_editable(self, obj):
        user = self.context.get("request")
        if user:
            return user.user.id == obj.creator.id.id
        return False

    def create(self, validated_data):
        instance, created = models.ContractTemplate.objects.get_or_create(
            name=validated_data["name"],
            service=validated_data["service"],
            defaults={
                "creator": self.context.get("request").user.counterparty,
                "template": validated_data["template"]
            }
        )
        if not created:
            raise AlreadyExistsException(TEMPLATE_EXIST)
        return instance

    def update(self, instance, validated_data):
        # Найти бы место по лучше для этой проверки
        user = self.context["request"].user
        if user.email not in ADMINS and instance.creator.id.email in ADMINS:
            raise ForbiddenToEditException(CANT_EDIT_GENERAL_TEMPLATE)

        instance.template = validated_data.get("template", instance.template)
        instance.save()
        return instance


"""Contracts"""


class ContractBaseSerializer(serializers.ModelSerializer):
    """
    Информация о всех контрактах

    сюда не включается сам контракт т.к. он может быть большим
    сюда не включаются данные контрагентов

    приходится выполнять второй запрос на получение подробной
    информации о конкретном, одном договоре

    От клиента принимает на вход поля: counterparty и template,
    возвращаются четыре поля что ниже:
    """
    counterparty = serializers.PrimaryKeyRelatedField(
        queryset=models.Counterparty.objects.all(),
        write_only=True,
        allow_null=True
    )

    template = serializers.PrimaryKeyRelatedField(
        queryset=models.ContractTemplate.objects.select_related("service").all(),
        write_only=True
    )

    template__id = serializers.IntegerField(source='template.pk', read_only=True)
    template__name = serializers.CharField(source='template.name', read_only=True)
    counterparty__id = serializers.IntegerField(source='counterparty.pk', read_only=True)
    counterparty__name = serializers.CharField(source='counterparty.name', read_only=True)

    class Meta:
        model = models.Contract
        fields = [
            "id",

            "name",
            "counterparty",
            "template",

            "counterparty__id",
            "counterparty__name",
            "template__id",
            "template__name",
            "status",
            "year",
        ]
        read_only_fields = [
            # in output only
            "id",
            "counterparty__id",
            "counterparty__name",
            "template__id",
            "template__name",
            "status",
            "year",
        ]

    def validate(self, data):
        if self.context.get("request") is None:
            raise serializers.ValidationError("Need to pass request object to context")
        return data

    def validate_counterparty(self, value):
        """
        Клиент может кидать в counterparty None, если это заказчик.
        Происходит проверка на то заказчик ли это если там None
        """
        if value is None:
            if self.context["request"].user.email in ADMINS:
                raise serializers.ValidationError(COUNTERPARTY_NOT_SELECTED)
            # Если контракт создает не админ, а заказчик, то контрагентом будет он же
            return self.context["request"].user.counterparty
        return value


class ContractDetailSerializer(ContractBaseSerializer):
    """
    Информация о конкретном, одном договоре + новые данные
    входные данные те же

    Помимо информации о договоре возвращает поле `contract` и `keys`
    поле `keys` содержит информацию о контрагентах, что полезно
    при составлении договора (имеется быстрый доступ к информации)

    Так, после получения контракта не надо второй раз кидать
    запрос на сервер для получения информации еще и контрагентах.
    Все в пределах одного запроса
    """
    keys = serializers.SerializerMethodField()
    status = serializers.EmailField(allow_null=True, allow_blank=True)

    class Meta(ContractBaseSerializer.Meta):
        fields = ContractBaseSerializer.Meta.fields + [
            # + контракт и статус в input
            "contract",
            "keys",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._key_fields = None
        self._contract = None

    def get_keys(self, obj):
        """Возвращает данные исполнителя и заказчика в поле keys"""
        if self._key_fields is not None:
            return self._key_fields

        if not isinstance(obj, models.Contract):
            obj = models.Contract(**obj)

        admin_data = models.Counterparty.objects.get(id__email__in=ADMINS)
        self._key_fields = get_key_fields(obj.name,
                                          obj.template.service,
                                          obj.counterparty,
                                          admin_data)
        return self._key_fields

    def _get_contract(self, obj):
        """Создает договор из шаблона, без сохранения его в базу данных"""
        if self._contract is not None:
            return self._contract

        if not isinstance(obj, models.Contract):
            obj = models.Contract(**obj)

        self._contract = form_contract(obj.template.template, self.get_keys(obj))
        return self._contract

    def create(self, validated_data):
        """
        Создает новый договор, формируя его из шаблона и сохраняет в БД
        """
        if self.context["request"].user.email not in ADMINS:
            status = "ожидает согласования поставщиком"
        else:
            status = "ожидает согласования заказчиком"

        contract = validated_data.get("contract")
        print("CONTRACT: ", contract)
        if not contract:
            print("CONTRACT: ", not contract)
            contract = self._get_contract(validated_data)

        instance, created = models.Contract.objects.get_or_create(
            name=validated_data["name"],
            counterparty=validated_data["counterparty"],
            defaults={
                "template": validated_data["template"],
                "contract": contract,
                "year": timezone.now().year,
                "status": status
            }
        )

        self.get_keys(validated_data)
        instance.created = created
        if not created:
            return instance
        return instance

    def update(self, instance, validated_data):
        is_admin = self.context["request"].user.email in ADMINS
        contract = validated_data.get("contract", instance.contract)
        changed = contract is not instance.contract
        status = update_status(instance.status, is_admin, changed)

        keys = validated_data.keys()
        if "contract" not in keys and "status" not in keys:
            raise Exception("Изменение чего-либо кроме статуса и договора не возможно")

        instance.status = status
        instance.contract = contract
        instance.save()
        return instance


"""Services"""


class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.ServicesReference
        fields = "__all__"

    def create(self, validated_data):
        instance, created = models.ServicesReference.objects.get_or_create(
            name=validated_data["name"],
            defaults={
                "price": validated_data["price"],
                "year": validated_data["year"]
            }
        )
        instance.created = created
        return instance

from rest_framework import serializers
from django.utils import timezone

from accounts.models import User
from .config import COUNTERPARTY_NOT_SELECTED, TEMPLATE_EXIST, CANT_EDIT_GENERAL_TEMPLATE, SERVICE_EXIST
from .services import form_contract, get_bank_info, update_status, Keys
from .exceptions import AlreadyExistsException, ForbiddenToEditException
from .config import CONTRACT_EXIST_ADMIN, CONTRACT_EXIST
from . import models


class CounterpartySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="id.email")
    password = serializers.CharField(write_only=True)

    class Meta:
        model = models.Counterparty
        fields = "__all__"

    def validate(self, attrs):
        """Проверка на то был ли передан БИК"""
        if attrs.get("BIC") is not None:
            bank_data = get_bank_info(attrs["BIC"])
            if bank_data is None:
                raise serializers.ValidationError("БИК банка не валиден")
            attrs.update(bank_data)

        return attrs

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
        if not user.is_admin and instance.creator.id.is_admin:
            raise ForbiddenToEditException(CANT_EDIT_GENERAL_TEMPLATE)

        instance.template = validated_data.get("template", instance.template)
        instance.save()
        return instance


"""Contracts"""


class ContractBaseSerializer(serializers.ModelSerializer):
    """Returns only essential parts about contracts, used mostly for list"""
    template__id = serializers.IntegerField(source='template.pk', read_only=True)
    template__name = serializers.CharField(source='template.name', read_only=True)
    counterparty__id = serializers.IntegerField(source='counterparty.pk', read_only=True)
    counterparty__name = serializers.CharField(source='counterparty.name', read_only=True)

    class Meta:
        model = models.Contract
        fields = [
            "id",
            "name",
            "counterparty__id",
            "counterparty__name",
            "template__id",
            "template__name",
            "status",
            "year",
        ]
        read_only_fields = [
            *fields
        ]


class ContractDetailsBaseSerializer(ContractBaseSerializer):
    """Returns detailed info about contract; all fields still readonly"""
    service__name = serializers.IntegerField(source='service.name', read_only=True)
    service__price = serializers.IntegerField(source='service.price', read_only=True)
    service__year = serializers.IntegerField(source='service.year', read_only=True)
    contract = serializers.JSONField(read_only=True)

    class Meta(ContractBaseSerializer.Meta):
        fields = ContractBaseSerializer.Meta.fields + [
            "service__name",
            "service__price",
            "service__year",
            "contract",
        ]


class ContractUpdateSerializer(ContractDetailsBaseSerializer):
    """Updates contract or it's status, depends on was it passed"""
    contract = serializers.JSONField(read_only=False)

    def update(self, instance, validated_data):
        """Field other than `contract` is ignored"""
        is_admin = self.context["request"].user.is_admin
        contract = validated_data.get("contract", instance.contract)
        changed = contract is not instance.contract

        try:
            status = update_status(instance.status, is_admin, changed)
        except Exception as e:
            raise serializers.ValidationError(e)

        instance.status = status
        instance.contract = contract
        instance.save()
        return instance


class ContractCreationSerializer(ContractDetailsBaseSerializer):
    """Creates new contract from specified fields"""
    name = serializers.CharField(read_only=False)

    class Meta(ContractDetailsBaseSerializer.Meta):
        fields = ContractDetailsBaseSerializer.Meta.fields + [
            "counterparty",
            "template",
        ]
        extra_kwargs = {
            "counterparty": {"write_only": True},
            "template": {"write_only": True},
        }

    def validate_counterparty(self, value):
        """Ignore `counterparty` field if client set it
        Client is counterparty if he creates contract"""
        if self.context["request"].user.is_admin:
            if value is not None: return value
            raise serializers.ValidationError(COUNTERPARTY_NOT_SELECTED)
        return self.context["request"].user.counterparty

    @property
    def new_status(self):
        if self.context["request"].user.is_admin:
            return "ожидает согласования поставщиком"
        return "ожидает согласования заказчиком"

    def get_contract(self, obj):
        return form_contract(obj["template"].template, Keys(
            obj["name"],
            obj["template"].service.name,
            obj["template"].service.price,
            obj["template"].service.year,
            models.Counterparty.objects.get(id__is_admin=True),
            obj["counterparty"]
        ))

    def create(self, validated_data):
        instance, created = models.Contract.objects.get_or_create(
            name=self.validated_data["name"],
            counterparty=self.validated_data["counterparty"],
            defaults={
                "template": self.validated_data["template"],
                "contract": self.get_contract(self.validated_data),
                "year": timezone.now().year,
                "status": self.new_status
            }
        )

        if not created:
            if self.context["request"].user.is_admin:
                raise AlreadyExistsException(CONTRACT_EXIST_ADMIN)
            raise AlreadyExistsException(CONTRACT_EXIST)
        return instance


class ContractPreviewSerializer(ContractCreationSerializer):
    contract = serializers.SerializerMethodField()

    def save(self):
        """Don't call `create`"""
        pass


class ContractSaveSerializer(ContractCreationSerializer):
    contract = serializers.JSONField(read_only=False)

    def get_contract(self, obj):
        """Don't form new contract"""
        return self.validated_data["contract"]


"""SERVICES"""


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

        if not created:
            raise serializers.ValidationError(SERVICE_EXIST)

        return instance

from rest_framework import serializers

from .models import Counterparty
from accounts.models import User

import xml.etree.ElementTree as ET

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


class CounterpartySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="id.email")
    password = serializers.CharField(write_only=True)

    FIELDS_TO_CHECK = {
        "head_first_name": "head_pos_first_name",
        "head_last_name": "head_pos_last_name",
        "head_middle_name": "head_pos_middle_name",
    }

    class Meta:
        model = Counterparty
        fields = "__all__"

    def validate(self, data):
        """ TODO: На клиенте происходит склонение ФИО в род. падеж, а так как клиент
                  сейчас один - сайт на js, то реализовать пока на сервере
                  склонение (для других клиентов где нет js) нет смысла.
                  На клиенте потому что попался инструмент хороший :)"""

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
        return Counterparty.objects.create(id=user, **counterparty_data)

    def update(self, instance, validated_data):
        instance.id.email = validated_data.get('id', instance.id.email)["email"]
        for field, value in validated_data.items():
            if field != "id":
                setattr(instance, field, value)
        instance.save()
        instance.id.save()
        return instance


from rest_framework import serializers
from .models import Counterparty


class CounterpartySerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="id.email")

    FIELDS_TO_CHECK = {
        "head_first_name": "head_pos_first_name",
        "head_last_name": "head_pos_last_name",
        "head_middle_name": "head_pos_middle_name",
    }

    class Meta:
        model = Counterparty
        fields = [
            "head_first_name",
            "head_pos_first_name",
            "head_last_name",
            "head_pos_last_name",
            "head_middle_name",
            "head_pos_middle_name",
            "email",
            "reason"
        ]

    def validate(self, data):
        """ TODO: На клиенте происходит склонение ФИО в род. падеж, а так как клиент
                  сейчас один - сайт на js, то реализовать пока на сервере
                  склонение (для других клиентов где нет js) нет смысла.

                  На клиенте потому что попался инструмент хороший :)"""

        for key, value in self.FIELDS_TO_CHECK.items():
            if key in data.keys() and value not in data.keys():
                # Тут преобразование в род. падеж, надо а ошибку убрать
                raise serializers.ValidationError("Ко мне не приходит ФИО в р.п. на клиенте ошибка")

        return data

    def update(self, instance, validated_data):
        instance.id.email = validated_data.get('id', instance.id.email)["email"]
        for field, value in validated_data.items():
            if field != "id":
                setattr(instance, field, value)
        instance.save()
        instance.id.save()
        return instance


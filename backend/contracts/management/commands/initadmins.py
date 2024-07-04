from django.core.management.base import BaseCommand
from contracts.serializers import CounterpartySerializer
from contracts.models import Counterparty
from accounts.models import User
import os


class Command(BaseCommand):

    def handle(self, *args, **options):
        if User.objects.count() == 0:
            email = os.getenv('EMAIL')
            passwd = os.getenv('PASSWORD')
            data = CounterpartySerializer(data={
                "name": os.getenv("NAME"),
                "full_name": os.getenv("FULL_NAME"),
                "INN": os.getenv("INN"),
                "KPP": os.getenv("KPP"),
                "BIC": os.getenv("BIC"),
                "checking_account": os.getenv("CHECKING_ACCOUNT"),
                "personal_account": os.getenv("PERSONAL_ACCOUNT"),
                "head_first_name": os.getenv("HEAD_FIRST_NAME"),
                "head_last_name": os.getenv("HEAD_LAST_NAME"),
                "head_middle_name": os.getenv("HEAD_MIDDLE_NAME"),
                "head_pos_first_name": os.getenv("HEAD_POS_FIRST_NAME"),
                "head_pos_last_name": os.getenv("HEAD_POS_LAST_NAME"),
                "head_pos_middle_name": os.getenv("HEAD_POS_MIDDLE_NAME")
            }, partial=True)

            if data.is_valid():
                print('Creating account for %s' % email)
                admin = User.objects.create_superuser(email=email, password=passwd)
                admin.is_active = True
                admin.is_admin = True
                admin.save()
                Counterparty.objects.create(id=admin, **data.validated_data)
            else:
                print("Ошибка: ", data.errors)
        else:
            print('Admin accounts can only be initialized if no Accounts exist')

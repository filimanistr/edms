from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate, APIRequestFactory
from rest_framework.authtoken.models import Token
from rest_framework import status

from accounts.models import User
from contracts import models, views
from contracts.config import ContractStatuses

# еще мб добавить какие сообщения присылаются
# при создании контрактов или изменении
# и всего прочего, тест на то что работает


data = {
    "name": "test",
    "full_name": "test",
    "INN": "test",
    "KPP": "test",
    "BIC": "test",
    "checking_account": "test",
    "personal_account": "test",
    "head_first_name": "test",
    "head_last_name": "test",
    "head_middle_name": "test",
    "head_pos_first_name": "test",
    "head_pos_last_name": "test",
    "head_pos_middle_name": "test"
}

def create_test_admin():
    email = "admin@gmail.com"
    admin = User.objects.create_superuser(email=email, password="0")
    models.Counterparty.objects.create(id=admin, **data)
    return admin

def create_test_user(username: str):
    user = User.objects.create_user(email=username, password="0")
    models.Counterparty.objects.create(id=user, **data)
    return user


def create_test_service():
    return models.ServicesReference.objects.create(name="test_service", price=15.00, year=1999)

def create_test_template(admin:models.Counterparty , service: models.ServicesReference):
    return models.ContractTemplate.objects.create(name="test_template",
                                                  creator=admin.counterparty,
                                                  template={"text":"test"},
                                                  service=service)

def create_test_contracts(admin: models.Counterparty, user: models.Counterparty):
    service = create_test_service()
    template = create_test_template(admin, service)
    return models.Contract.objects.create(name="test_contract",
                                          counterparty=user.counterparty,
                                          template=template,
                                          contract={"text":"test"},
                                          status=ContractStatuses.WAITING_ADMIN,
                                          year=2024)

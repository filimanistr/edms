from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate, APIRequestFactory
from rest_framework.authtoken.models import Token
from rest_framework import status

from accounts.models import User
from contracts import models, views
from contracts.config import ContractStatuses

# Create your tests here.

# еще мб добавить какие сообщения присылаются
# при создании контрактов или изменении
# и всего прочего, тест на то что работает


"""Creating users"""


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


"""Populating database"""


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


"""Tests"""


class ContractListViewTests(APITestCase):

    def setUp(self):
        self.admin = create_test_admin()
        self.user = create_test_user("user1@test.com")
        self.another_user = create_test_user("user2@test.com")

    def test_only_user_contracts_shown(self):
        """
        Для заказчика отображаются только его договора
        """
        user_contract = create_test_contracts(self.admin, self.user)
        create_test_contracts(self.admin, self.another_user)

        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/contracts/")
        response_contracts_ids = [i["id"] for i in response.data]
        user_contracts_ids = [i.pk for i in [user_contract]]

        self.assertEqual(response.status_code, 200)
        self.assertQuerySetEqual(response_contracts_ids, user_contracts_ids)

    def test_all_contracts_shown_to_admin(self):
        """
        Для исполнителя отображаются все договора
        """
        user_contract = create_test_contracts(self.admin, self.user)
        another_user_contract = create_test_contracts(self.admin, self.another_user)
        all_contracts = [user_contract, another_user_contract]

        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/contracts/")
        response_contracts_ids = [i["id"] for i in response.data]
        all_contracts_ids = [i.pk for i in all_contracts]

        self.assertEqual(response.status_code, 200)
        self.assertQuerySetEqual(response_contracts_ids, all_contracts_ids)

    def test_user_can_create_contracts_only_with_admin(self):
        """
        Заказчик может создавать договора только с исполнителем
        """
        service = create_test_service()
        template = create_test_template(self.admin, service)

        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/contracts/", {
            "name":"test name for contract",
            "counterparty":self.another_user,
            "template":template,
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ContractDetailViewTest(APITestCase):

    def setUp(self):
        self.admin = create_test_admin()
        self.user = create_test_user("user1@test.com")
        self.another_user = create_test_user("user2@test.com")

    def test_cannot_access_not_his_contract(self):
        """
        Заказчик не может получить доступ к договору не принадлежащему ему и изменять его
        """
        another_user_contract = create_test_contracts(self.admin, self.another_user)
        contract_id = another_user_contract.pk

        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/contracts/{contract_id}/")
        patch_response = self.client.patch(f"/api/contracts/{contract_id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(patch_response.status_code, status.HTTP_404_NOT_FOUND)

    """Проверка на доступ к изменению договора"""

    def test_user_cannot_edit_contract_if_awaiting_admin(self):
        """
        Заказчик не может менять договор если он в ожидании согласования поставщиком
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_ADMIN
        user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_cannot_edit_contract_if_awaiting_user(self):
        """
        Поставщик не может менять договор если он в ожидании согласования заказчиком
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_USER
        user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_edit_contract_if_approved(self):
        """
        Заказчик не может менять договор если он согласован
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.ACCEPTED
        user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_cannot_edit_contract_if_approved(self):
        """
        Поставщик не может менять договор если он согласован
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.ACCEPTED
        user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """Проверка на то что изменения договра коснулись"""

    def test_user_can_change_status(self):
        """
        Заказчик может согласовать договор
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_USER
        user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/", {"status":""})
        new_status = models.Contract.objects.get(pk=user_contract.pk).status

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_status, ContractStatuses.ACCEPTED)

    def test_user_can_change_contract(self):
        """
        Заказчик может вносить правки в договор
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_USER
        user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/", {"contract":"{}"})
        new_contract = models.Contract.objects.get(pk=user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_ADMIN)
        self.assertEqual(new_contract.contract, {})

    def test_admin_can_change_status(self):
        """
        Поставщик может согласовать договор
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_ADMIN
        user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/", {"status":""})
        new_status = models.Contract.objects.get(pk=user_contract.pk).status

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_status, ContractStatuses.ACCEPTED)

    def test_admin_can_change_contract(self):
        """
        Поставщик может вносить правки в договор
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_ADMIN
        user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/", {"contract":"{}"})
        new_contract = models.Contract.objects.get(pk=user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_USER)
        self.assertEqual(new_contract.contract, {})

    """Проверка на то что был передан и статус и контракт"""

    def test_cannot_update_contract_and_status_at_the_same_time(self):
        """
        От передачи и status и contract в payload к patch методу обновляется только контракт
        поведение то же что если бы и status вовсе не пересылался
        """
        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_ADMIN
        user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/", {"contract":"{}", "status":""})
        new_contract = models.Contract.objects.get(pk=user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_USER)
        self.assertEqual(new_contract.contract, {})

        # Для заказчика то же самое

        user_contract = create_test_contracts(self.admin, self.user)
        user_contract.status = ContractStatuses.WAITING_USER
        user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{user_contract.pk}/", {"contract":"{}", "status":""})
        new_contract = models.Contract.objects.get(pk=user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_ADMIN)
        self.assertEqual(new_contract.contract, {})


class TemplatesViewTests(APITestCase):

    def test_shown_only_general_and_his_templates(self):
        """
        Отображаются только общие и личные шаблоны этого заказчика
        """
        pass

    def test_edit_only_own_templates(self):
        """
        Контрагент может менять только свои шаблоны
        """
        pass


class CounterpartyViewsTests(APITestCase):

    def test_user_cant_access_all_counterparties(self):
        """
        Заказчик может получить информацию только о себе
        """
        pass

    def test_all_shown_to_admin(self):
        """
        Отображаются все заказчики для исполнителя
        """
        pass


    def test_can_only_edit_their_data(self):
        """
        Может менять только свою информацию
        """
        pass


class ServicesViewTests(APITestCase):

    def test_user_cant_create_service(self):
        """
        Заказчик не может создавать услуги
        """
        pass

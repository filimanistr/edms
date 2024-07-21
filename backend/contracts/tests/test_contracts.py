from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate, APIRequestFactory
from rest_framework.authtoken.models import Token
from rest_framework import status

from accounts.models import User
from contracts.models import Contract, ServicesReference, ContractTemplate

from contracts import models, views
from contracts.config import ContractStatuses


class BaseContractTests(APITestCase):
    fixtures = ["users.json", "counterparties.json", "contracts"]

    @classmethod
    def setUpTestData(cls):
        cls.admin = User.objects.get(is_admin=True)
        cls.user = User.objects.get(email="user1@test.com")
        cls.another_user = User.objects.get(email="user2@test.com")

        cls.service = ServicesReference.objects.get(pk=1)
        cls.general_template = ContractTemplate.objects.get(pk=1)
        cls.user_contract = Contract.objects.get(counterparty=cls.user.counterparty)
        cls.another_user_contract = Contract.objects.get(counterparty=cls.another_user.counterparty)


class ContractListViewTests(BaseContractTests):

    def test_only_user_contracts_shown(self):
        """
        Для заказчика отображаются только его договора
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/contracts/")
        response_contracts_ids = [i["id"] for i in response.data]
        user_contracts_ids = [i.pk for i in [self.user_contract]]

        self.assertEqual(response.status_code, 200)
        self.assertQuerySetEqual(response_contracts_ids, user_contracts_ids)

    def test_all_contracts_shown_to_admin(self):
        """
        Для исполнителя отображаются все договора
        """
        all_contracts = [self.user_contract, self.another_user_contract]
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
        service = self.service
        template = self.general_template

        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/contracts/", {
            "name":"test name for contract",
            "counterparty":self.another_user,
            "template":template,
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ContractDetailViewTest(BaseContractTests):

    def test_cannot_access_not_his_contract(self):
        """
        Заказчик не может получить доступ к договору не принадлежащему ему и изменять его
        """
        contract_id = self.another_user_contract.pk
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
        self.user_contract.status = ContractStatuses.WAITING_ADMIN
        self.user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_cannot_edit_contract_if_awaiting_user(self):
        """
        Поставщик не может менять договор если он в ожидании согласования заказчиком
        """
        self.user_contract.status = ContractStatuses.WAITING_USER
        self.user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_edit_contract_if_approved(self):
        """
        Заказчик не может менять договор если он согласован
        """
        self.user_contract.status = ContractStatuses.ACCEPTED
        self.user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_cannot_edit_contract_if_approved(self):
        """
        Поставщик не может менять договор если он согласован
        """
        self.user_contract.status = ContractStatuses.ACCEPTED
        self.user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """Проверка на то что изменения договра коснулись"""

    def test_user_can_change_status(self):
        """
        Заказчик может согласовать договор
        """
        self.user_contract.status = ContractStatuses.WAITING_USER
        self.user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/", {"status":""})
        new_status = models.Contract.objects.get(pk=self.user_contract.pk).status

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_status, ContractStatuses.ACCEPTED)

    def test_user_can_change_contract(self):
        """
        Заказчик может вносить правки в договор
        """
        self.user_contract.status = ContractStatuses.WAITING_USER
        self.user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/", {"contract":"{}"})
        new_contract = models.Contract.objects.get(pk=self.user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_ADMIN)
        self.assertEqual(new_contract.contract, {})

    def test_admin_can_change_status(self):
        """
        Поставщик может согласовать договор
        """
        self.user_contract.status = ContractStatuses.WAITING_ADMIN
        self.user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/", {"status":""})
        new_status = models.Contract.objects.get(pk=self.user_contract.pk).status

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_status, ContractStatuses.ACCEPTED)

    def test_admin_can_change_contract(self):
        """
        Поставщик может вносить правки в договор
        """
        self.user_contract.status = ContractStatuses.WAITING_ADMIN
        self.user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/", {"contract":"{}"})
        new_contract = models.Contract.objects.get(pk=self.user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_USER)
        self.assertEqual(new_contract.contract, {})

    """Проверка на то что был передан и статус и контракт"""

    def test_cannot_update_contract_and_status_at_the_same_time(self):
        """
        От передачи и status и contract в payload к patch методу обновляется только контракт
        поведение то же что если бы и status вовсе не пересылался
        """
        self.user_contract.status = ContractStatuses.WAITING_ADMIN
        self.user_contract.save()

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/", {"contract":"{}", "status":""})
        new_contract = models.Contract.objects.get(pk=self.user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_USER)
        self.assertEqual(new_contract.contract, {})

        # Для заказчика то же самое

        self.user_contract.status = ContractStatuses.WAITING_USER
        self.user_contract.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/contracts/{self.user_contract.pk}/", {"contract":"{}", "status":""})
        new_contract = models.Contract.objects.get(pk=self.user_contract.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_contract.status, ContractStatuses.WAITING_ADMIN)
        self.assertEqual(new_contract.contract, {})

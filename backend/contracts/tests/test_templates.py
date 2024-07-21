from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate, APIRequestFactory
from rest_framework.authtoken.models import Token
from rest_framework import status

from accounts.models import User
from contracts.models import ServicesReference, ContractTemplate
from contracts import models, views
from contracts.config import ContractStatuses


class BaseContractTests(APITestCase):
    fixtures = ["users.json", "counterparties.json", "templates.json"]

    @classmethod
    def setUpTestData(cls):
        cls.admin = User.objects.get(is_admin=True)
        cls.user = User.objects.get(email="user1@test.com")
        cls.another_user = User.objects.get(email="user2@test.com")

        cls.service = ServicesReference.objects.get(pk=1)

        cls.general_template = ContractTemplate.objects.get(pk=1)
        cls.user_template = ContractTemplate.objects.get(pk=2)
        cls.another_user_template = ContractTemplate.objects.get(pk=3)


class TemplateDetailViewTests(BaseContractTests):

    """Retrieve"""

    def test_cant_see_other_user_templates(self):
        """
        Заказчик не может просматривать шаблоны другого заказчика
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/templates/{self.another_user_template.pk}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_can_see_general_and_own_templates(self):
        """
        Заказчик может просмотривать общие шаблоны и личные шаблоны
        """
        self.client.force_authenticate(user=self.user)
        ut_response = self.client.get(f"/api/templates/{self.user_template.pk}/")
        gent_response = self.client.get(f"/api/templates/{self.general_template.pk}/")
        self.assertEqual(ut_response.status_code, status.HTTP_200_OK)
        self.assertEqual(gent_response.status_code, status.HTTP_200_OK)

    def test_admin_can_view_all_templates(self):
        """
        Исполнитель может просматривать все шаблоны
        """
        self.client.force_authenticate(user=self.admin)
        ut_response = self.client.get(f"/api/templates/{self.user_template.pk}/")
        aut_response = self.client.get(f"/api/templates/{self.another_user_template.pk}/")
        gent_response = self.client.get(f"/api/templates/{self.general_template.pk}/")
        self.assertEqual(ut_response.status_code, status.HTTP_200_OK)
        self.assertEqual(aut_response.status_code, status.HTTP_200_OK)
        self.assertEqual(gent_response.status_code, status.HTTP_200_OK)

    """Update"""

    def test_cant_edit_other_user_templates(self):
        """
        Заказчик не может редактировать шаблоны другого заказчика
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/templates/{self.another_user_template.pk}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cant_edit_general_templates(self):
        """
        Заказчик не может редактировать общие шаблоны
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/templates/{self.general_template.pk}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_edit_only_own_templates(self):
        """
        Заказчик может редактировать только свои шаблоны
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/templates/{self.user_template.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_edit_all_templates(self):
        """
        Исполнитель может изменять все шаблоны (сомнительно)
        """
        self.client.force_authenticate(user=self.admin)
        ut_response = self.client.patch(f"/api/templates/{self.user_template.pk}/")
        aut_response = self.client.patch(f"/api/templates/{self.another_user_template.pk}/")
        gent_response = self.client.patch(f"/api/templates/{self.general_template.pk}/")
        self.assertEqual(ut_response.status_code, status.HTTP_200_OK)
        self.assertEqual(aut_response.status_code, status.HTTP_200_OK)
        self.assertEqual(gent_response.status_code, status.HTTP_200_OK)


class TemplatesListViewTests(BaseContractTests):

    def test_user_see_his_and_general_templates(self):
        """
        Для заказчика отображаются только общие и личные шаблоны
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/templates/")
        response_templates_ids = [i["id"] for i in response.data["data"]]
        general_and_user_templates_ids = [i.pk for i in [self.general_template, self.user_template]]

        self.assertEqual(response.status_code, 200)
        self.assertQuerySetEqual(response_templates_ids, general_and_user_templates_ids)

    def test_admin_see_all_templates(self):
        """
        Для исполнителя отображаются все шаблоны
        """
        all_templates = [self.general_template, self.user_template, self.another_user_template]
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/templates/")
        response_templates_ids = [i["id"] for i in response.data["data"]]
        all_templates_ids = [i.pk for i in all_templates]

        self.assertEqual(response.status_code, 200)
        self.assertQuerySetEqual(response_templates_ids, all_templates_ids)

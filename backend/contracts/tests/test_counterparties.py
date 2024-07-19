from rest_framework.test import APITestCase
from rest_framework import status

from .tests import *


class CounterpartyViewsTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.admin = create_test_admin()
        cls.user = create_test_user("user1@test.com")
        cls.another_user = create_test_user("user2@test.com")

    def test_user_cant_access_all_counterparties(self):
        """
        Заказчик не может получить информацию о других пользователях
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/counterparties/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_all_shown_to_admin(self):
        """
        Исполнитель может получить информацию о всех заказчиках
        """
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/counterparties/")
        response_ids= [i["id"] for i in response.data]
        ids = [self.user.counterparty.pk, self.another_user.counterparty.pk]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_ids, ids)

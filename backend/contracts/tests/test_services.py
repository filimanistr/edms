from rest_framework.test import APITestCase
from rest_framework import status

from accounts.models import User


class ServicesViewTests(APITestCase):
    fixtures = ["users.json"]

    @classmethod
    def setUpTestData(cls):
        cls.admin = User.objects.get(is_admin=True)
        cls.user = User.objects.get(email="user1@test.com")
        cls.another_user = User.objects.get(email="user2@test.com")

    def test_user_cant_create_service(self):
        """
        Заказчик не может создавать услуги
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/services/", {
            "name":"test name for service",
            "price":15.00,
            "year":2024,
        })

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

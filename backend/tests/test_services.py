from rest_framework.test import APITestCase

from .tests import *


class ServicesViewTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.admin = create_test_admin()
        cls.user = create_test_user("user1@test.com")
        cls.another_user = create_test_user("user2@test.com")

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

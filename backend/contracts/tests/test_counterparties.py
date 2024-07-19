from rest_framework.test import APITestCase


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

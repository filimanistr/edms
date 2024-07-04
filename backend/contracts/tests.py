from django.test import TestCase

# Create your tests here.
# ЗАЧЕМ ЭТИ ТЕСТЫ ДЕЛАТЬ ЕСЛИ ЭТО БУКВАЛЬНО ПРОВЕРКА ОДНОЙ СТРОЧКИ
# TODO: Закончить потом это


def create_test_admin():
    pass


def create_test_user():
    pass


class ContractViewTests(TestCase):

    def test_only_user_contracts_shown(self):
        """
        Отображаются только договора этого заказчика
        """
        pass

    def test_user_can_create_contracts_only_with_admin(self):
        """
        Заказчик может создавать договора только с исполнителем
        """
        pass

    def test_edit_only_own_editable_contracts(self):
        """
        Контрагент может менять только свои договора со статусом ожидания
        """
        pass


class TemplatesViewTests(TestCase):

    def test_shown_only_general_and_his_templates(self):
        """
        Отображаются только общие и личные шаблоны этого контрагнета
        """
        pass

    def test_edit_only_own_templates(self):
        """
        Контрагент может менять только свои шаблоны
        """
        pass


class CounterpartyViewsTests(TestCase):

    def test_can_only_edit_their_data(self):
        """
        Может менять только свою инфу
        """
        pass


class ServicesViewTests(TestCase):

    def test_user_cant_create_service(self):
        """
        Заказчик не может создавать услуги
        """
        pass


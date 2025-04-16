from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
import click


class Command(BaseCommand):

    def handle(self, *args, **options):
        user = get_user_model()
        if user.objects.count() > 0:
            print("Администратор уже инициализирован")
            return

        print("Первичная регистрация исполнителя в системе:")
        email = click.prompt("Введите почту: ", type=str)
        passwd = click.prompt("Введите временный пароль: ", type=str)
        user.objects.create_superuser(email=email, password=passwd)
        print("Для завершения конфигурации:")
        print("зарегистрируйтесь на сайте")
        print("http://localhost:3000")

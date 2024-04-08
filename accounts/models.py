from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class CustomManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Необходимо внести почту")
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """Возможно стоит тут использовать только username,
        но с почтой надежнее будет"""
        user = self.create_user(
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(verbose_name="email address",
                              max_length=255,
                              unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomManager()

    # A string describing the name of the field on the
    # user model that is used as the unique identifier
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """Returns True if the user has the named permission. If obj is provided,
        the permission needs to be checked against a specific object instance"""
        # TODO: Пока что особых разрешений нет, поэтому возвращает True
        return True

    def has_module_perms(self, app_label):
        """Returns True if the user has permission to access models in the given app"""
        # TODO: То же в будущем должен быть пересмотрен
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # TODO: Simplest possible answer: All admins are staff
        return self.is_admin

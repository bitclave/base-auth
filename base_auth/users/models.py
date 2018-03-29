import uuid

from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils.translation import ugettext_lazy as _

from base_auth.utils.django_models import ModelDefaultsMixin


class User(ModelDefaultsMixin, AbstractUser):
    email = models.EmailField(_('email address'), max_length=100, blank=True)
    email_is_verified = models.BooleanField(default=False)
    email_verification_code = models.UUIDField(unique=True, default=uuid.uuid4)
    email_verification_at = models.DateTimeField(null=True, blank=True)

    first_name = models.CharField(_('first name'), max_length=100, blank=True)
    last_name = models.CharField(_('last name'), max_length=100, blank=True)

    objects = UserManager()

    class Meta(AbstractUser.Meta):
        swappable = 'AUTH_USER_MODEL'

    @property
    def has_enabled_2fa(self):
        return self.totpdevice_set.exists()

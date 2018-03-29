from datetime import timedelta

import waffle
from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from base_auth.users.models import User

ENABLE_2FA_INTERVAL = timedelta(hours=36)


class Command(BaseCommand):

    def handle(self, *args, **options):
        if not waffle.switch_is_active(settings.SWITCHES.DEACTIVATE_STAFF_WITHOUT_2FA):
            return

        now = timezone.now()
        staff_without_2fa = User.objects.filter(is_staff=True, totpdevice__isnull=True)
        staff_without_2fa.filter(date_joined__lt=now - ENABLE_2FA_INTERVAL).update(is_active=False)

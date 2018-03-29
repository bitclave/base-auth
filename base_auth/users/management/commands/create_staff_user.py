import random
import string

from django.core.management.base import BaseCommand

from base_auth.users.models import User


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('username', type=str)

    def handle(self, *args, **options):
        username = options['username']
        email = f'{username}@matchico.com'
        password_chars = string.ascii_letters + ''.join(str(x) for x in range(10))
        password = ''.join(random.sample(password_chars, 32))

        print('Username:', username)
        print('Password:', password)
        User.objects.create_user(
            is_staff=True,
            is_email_verified=True,
            email=email,
            username=username,
            password=password)

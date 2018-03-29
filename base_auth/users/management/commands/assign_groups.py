from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from base_auth.users.models import User


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('username', type=str)
        parser.add_argument('group', type=str, nargs='+')

    def handle(self, *args, **options):
        user = User.objects.get(is_staff=True, username=options['username'])
        user.groups.set([Group.objects.get(name=group_name) for group_name in options['group']])

import pytest
from django.test import Client
from pytest_factoryboy import register

from base_auth.tests import factories
from base_auth.users.models import User

register(factories.UserFactory)


@pytest.fixture()
def auth_client(client: Client, user: User) -> Client:
    client.force_login(user)
    return client

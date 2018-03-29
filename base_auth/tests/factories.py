import factory
from django.utils import timezone

from base_auth.users.models import User


class UserFactory(factory.DjangoModelFactory):

    class Meta:
        model = User

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.Faker('email')
    password = factory.PostGenerationMethodCall('set_password', 'password')
    email_is_verified = True
    is_staff = False
    is_active = True
    date_joined = factory.LazyFunction(timezone.now)

    @factory.lazy_attribute
    def username(self):
        return self.email

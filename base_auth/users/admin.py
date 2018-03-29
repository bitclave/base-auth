from django.contrib import admin

from base_auth.users.models import User
from base_auth.utils.admin import (
    GenericAdminMixin,
    RawIdFieldsAdminMixin,
    ReadOnlyAdminMixin,
    RelatedFieldURLMixin
)


@admin.register(User)
class UserAdmin(ReadOnlyAdminMixin, RelatedFieldURLMixin, GenericAdminMixin, RawIdFieldsAdminMixin,
                admin.ModelAdmin):
    search_fields = ('=email', )

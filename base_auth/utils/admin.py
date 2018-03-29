import django.contrib.admin
from django.core.exceptions import FieldDoesNotExist
from django.core.urlresolvers import reverse
from django.db.models.fields import BooleanField, NullBooleanField
from django.utils.safestring import mark_safe

import base_auth.utils.django_models


def allow_tags(obj):
    obj.allow_tags = True
    return obj


def boolean(obj):
    obj.boolean = True
    return obj


def short_description(description):

    def short_description(obj):
        obj.short_description = description
        return obj

    return short_description


def order_field(model_field):

    def order_field(obj):
        obj.admin_order_field = model_field
        return obj

    return order_field


class AdminChangePageURLField:

    def __init__(self, short_description_, related_field):
        self.short_description = short_description_
        self.admin_order_field = related_field
        self._related_field = related_field

    def __call__(self, obj):
        related_obj = getattr(obj, self._related_field)

        if related_obj is None:
            return '-'

        related_obj_app = related_obj._meta.app_label
        related_obj_model = related_obj._meta.model_name
        related_obj_url_name = f'admin:{related_obj_app}_{related_obj_model}_change'
        change_url = reverse(related_obj_url_name, args=(related_obj.pk, ))

        return mark_safe('<a href="{}">{}</a>'.format(change_url, str(related_obj)))


class RelatedFieldURLMixin:
    list_display_relation_urls = True
    fields_relation_urls = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.fields:
            self.fields = list(self.fields)
        self.readonly_fields = list(self.readonly_fields)
        self.list_display = list(self.list_display)

        related_fields = dict()
        all_fields = set(self.fields or []) | set(self.readonly_fields) | set(self.list_display)

        for field_name in all_fields:
            try:
                field = self.model._meta.get_field(field_name)
            except FieldDoesNotExist:
                continue
            if field.one_to_many or field.one_to_one or field.many_to_one:
                related_fields[field_name] = field

        for field_name, field in related_fields.items():
            method_name = f'{field_name}_change_url'
            try:
                setattr(self, method_name, AdminChangePageURLField(field.verbose_name, field.name))
            except AttributeError:
                continue

            if self.list_display_relation_urls and field_name in self.list_display:
                self.list_display[self.list_display.index(field_name)] = method_name

            if self.fields_relation_urls and self.fields and field_name in self.fields:
                self.fields[self.fields.index(field_name)] = method_name

            if field_name in self.readonly_fields:
                self.readonly_fields[self.readonly_fields.index(field_name)] = method_name


class RawIdFieldsAdminMixin(object):

    def __init__(self, *args, **kwargs):
        super(RawIdFieldsAdminMixin, self).__init__(*args, **kwargs)

        self.raw_id_fields = [
            field.name for field in self.model._meta.get_fields()
            if field.many_to_many or field.many_to_one
        ]


class GenericAdminMixin(object):

    def __init__(self, *args, **kwargs):
        super(GenericAdminMixin, self).__init__(*args, **kwargs)

        self.fields = list(self.fields or [])
        self.fields.append('id')
        self.readonly_fields = list(self.readonly_fields)
        self.readonly_fields.append('id')
        self.list_display = list(self.list_display)
        self.list_display.append('id')

        self.list_filter = list(self.list_filter)
        self.search_fields = list(self.search_fields)

        if not self.ordering:
            self.ordering = ['-id']

        for field in self.model._meta.get_fields():
            if isinstance(field, (BooleanField, NullBooleanField)):
                self.list_filter.append((field.name, django.contrib.admin.BooleanFieldListFilter))

        fields = [field for field in self.model._meta.get_fields() if not field.one_to_many]

        for field in fields:
            if field.name not in self.fields:
                self.fields.append(field.name)
            if not field.many_to_many and field.name not in self.list_display:
                self.list_display.append(field.name)


class ReadOnlyAdminMixin(object):
    change_form_template = "admin/view.html"

    def __init__(self, *args, **kwargs):
        super(ReadOnlyAdminMixin, self).__init__(*args, **kwargs)
        self.readonly_fields = list(self.readonly_fields or [])
        self.readonly_fields.extend(
            list(base_auth.utils.django_models.get_all_fields_names(self.model)))

    def get_actions(self, request):
        actions = super(ReadOnlyAdminMixin, self).get_actions(request)
        del actions["delete_selected"]
        return actions

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        pass

    def delete_model(self, request, obj):
        pass

    def save_related(self, request, form, formsets, change):
        pass

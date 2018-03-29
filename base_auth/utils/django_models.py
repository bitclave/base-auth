from django.db import models
from django.db.models import Func
from django.utils import timezone


def get_all_fields_names(model):
    return (field.name for field in model._meta.get_fields())


class ModelDefaultsMixin(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f'{self.__class__.__name__}#{self.id}'

    def save(self, update_fields=None, *args, **kwargs):
        if update_fields:
            update_fields = set(update_fields)
            update_fields.add('updated_at')

        super().save(update_fields=update_fields, *args, **kwargs)

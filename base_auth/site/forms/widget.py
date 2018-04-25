from django import forms
from django.utils.translation import ugettext_lazy as _


class AuthRequestForm(forms.Form):
    application_public_key = forms.CharField(min_length=66, max_length=66)
    application_origin = forms.URLField()
    user_permissions = forms.CharField()


class LoginPasswordForm(forms.Form):
    login = forms.CharField(
        max_length=100,
        label=_('Login'),
        help_text=lambda: _('Enter your login'),
    )
    password = forms.CharField(
        widget=forms.PasswordInput,
        label=_('Password'),
        help_text=lambda: _('Enter your password'),
    )

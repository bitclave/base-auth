from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic import FormView, TemplateView

from base_auth.site.forms.widget import AuthRequestForm, LoginPasswordForm
from base_auth.users.services import BASELoginPasswordAuth


class ExampleView(TemplateView):
    template_name = 'widget/example.html'


class WidgetSDKView(TemplateView):
    template_name = 'widget/sdk.js'


@method_decorator(xframe_options_exempt, name='dispatch')
class WidgetButtonView(TemplateView):
    template_name = 'widget/button.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['BASE_NODE_URL'] = settings.BASE_NODE_URL
        return context


class WidgetPopupView(FormView):
    form_class = LoginPasswordForm
    template_name = 'widget/popup.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        auth_request_form = AuthRequestForm(data=self.request.GET)
        if not auth_request_form.is_valid():
            raise ValidationError(auth_request_form.errors)

        context['application_public_key'] = auth_request_form.cleaned_data['application_public_key']
        context['application_origin'] = auth_request_form.cleaned_data['application_origin']
        context['user_permissions'] = auth_request_form.cleaned_data['user_permissions'].split(',')

        return context

    def form_valid(self, form) -> int:
        login = form.cleaned_data['login']
        password = form.cleaned_data['password']

        auth_request_form = AuthRequestForm(data=self.request.GET)

        if not auth_request_form.is_valid():
            raise ValidationError(auth_request_form.errors)

        application_public_key = auth_request_form.cleaned_data['application_public_key']
        application_origin = auth_request_form.cleaned_data['application_origin']
        user_permissions = auth_request_form.cleaned_data['user_permissions'].split(',')

        authenticator = BASELoginPasswordAuth(
            application_public_key,
            application_origin,
            user_permissions,
            login,
            password,
        )
        public_key, access_token, expiration_date = authenticator.authenticate()

        # TODO Save access token and the date into cookies

        return super().form_valid(form)

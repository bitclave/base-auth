from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic import TemplateView


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


class WidgetPopupView(TemplateView):
    template_name = 'widget/popup.html'

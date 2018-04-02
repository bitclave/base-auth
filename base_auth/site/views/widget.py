from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic import TemplateView


class ExampleView(TemplateView):
    template_name = 'widget/example.html'


class WidgetJSView(TemplateView):
    template_name = 'widget/widget.js'


@method_decorator(xframe_options_exempt, name='dispatch')
class WidgetButtonView(TemplateView):
    template_name = 'widget/button.html'


class WidgetPopupView(TemplateView):
    template_name = 'widget/popup.html'

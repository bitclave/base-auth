from django.conf.urls import url

from base_auth.site.views import widget

urlpatterns = [
    url(r'^button/$', widget.WidgetButtonView.as_view(), name='button'),
    url(r'^example/$', widget.ExampleView.as_view(), name='example'),
    url(r'^popup/$', widget.WidgetPopupView.as_view(), name='popup'),
    url(r'^widget.js$', widget.WidgetJSView.as_view(), name='widget-js'),
]

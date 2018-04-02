from django.conf.urls import url
from django.conf.urls import url, include

from base_auth.site.views import index, tos

urlpatterns = [
    url(r'^$', index.IndexView.as_view(), name='index'),
    url(r'^tos/$', tos.TosView.as_view(), name='tos'),
    url(r'^widget/', include('base_auth.site.urls.widget', namespace='widget')),
]

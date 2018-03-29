from django.conf.urls import url

from base_auth.site.views import index, tos

urlpatterns = [
    url(r'^$', index.IndexView.as_view(), name='index'),
    url(r'^tos/$', tos.TosView.as_view(), name='tos'),
]

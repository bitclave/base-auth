from django.conf.urls import url

from base_auth.site.views import two_factor_auth

urlpatterns = [
    url(
        regex=r'^account/two_factor/$',
        view=two_factor_auth.OverrideProfileView.as_view(),
        name='profile',
    ),
]

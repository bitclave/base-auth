from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include('admin_honeypot.urls', namespace='admin_honeypot')),
    url(r'^02a9911a-90d9-44d4-b103-d51556035c3c/', admin.site.urls),
    url(r'', include('base_auth.site.urls.two_factor_auth', 'two_factor_auth')),
    url(r'', include('two_factor.urls', 'two_factor')),
    url(r'', include('base_auth.site.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

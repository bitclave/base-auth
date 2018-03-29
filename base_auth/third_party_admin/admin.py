from django.contrib import admin
from django_otp.plugins.otp_static.models import StaticDevice
from django_otp.plugins.otp_totp.models import TOTPDevice
from two_factor.models import PhoneDevice

admin.site.unregister(PhoneDevice)
admin.site.unregister(StaticDevice)
admin.site.unregister(TOTPDevice)

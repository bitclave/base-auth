import os
from datetime import timedelta

import dj_database_url
import dj_redis_url
from django.urls import reverse_lazy
from django.utils.translation import ugettext_lazy as _

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = os.path.dirname(PROJECT_DIR)


SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = bool(int(os.environ['DEBUG']))
SECURE_HSTS_SECONDS = 86400

ALLOWED_HOSTS = [
    os.environ['HOST'],
    os.environ['HOST'][4:],
]


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.humanize',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'admin_honeypot',
    'captcha',
    'django_otp',
    'django_otp.plugins.otp_static',
    'django_otp.plugins.otp_totp',
    'raven.contrib.django.raven_compat',
    'social_django',
    'storages',
    'two_factor',
    'waffle',
    'widget_tweaks',

    'base_auth.site',
    'base_auth.users',
    'base_auth.utils',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django_otp.middleware.OTPMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
    'waffle.middleware.WaffleMiddleware',
]

ROOT_URLCONF = 'base_auth.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(PROJECT_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'base_auth.site.context_processors.site_url',
            ],
        },
    },
]

WSGI_APPLICATION = 'base_auth.wsgi.application'


DATABASES = {
    'default': dj_database_url.config()
}

REDIS = {
    'default': {k.lower(): v for k, v
                in dj_redis_url.parse(os.environ['REDIS_URL']).items()},
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'users.User'

LOGIN_URL = 'two_factor:login'
LOGIN_REDIRECT_URL = '/'
TWO_FACTOR_PATCH_ADMIN = True

TIME_ZONE = 'UTC'

LANGUAGE_CODE = 'en'
LANGUAGES = (
    ('en', _('English')),
)

USE_I18N = True
USE_L10N = True
USE_TZ = True
LOCALE_PATHS = (
    os.path.join(PROJECT_DIR, 'locale'),
)


STATIC_URL = '/static/'
STATIC_ROOT = None
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'statics'),
)

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/prod/media/'

SESSION_COOKIE_AGE = int(timedelta(minutes=30).total_seconds())
SESSION_COOKIE_DOMAIN = os.environ['HOST']
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = bool(int(os.environ['SESSION_COOKIE_SECURE']))

SECURE_SSL_REDIRECT = bool(int(os.environ['SESSION_COOKIE_SECURE']))

EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_HOST_USER = os.environ['EMAIL_USER']
EMAIL_HOST_PASSWORD = os.environ['EMAIL_PASSWORD']
EMAIL_PORT = os.environ['EMAIL_PORT']
EMAIL_USE_TLS = bool(int(os.environ['EMAIL_TSL']))
EMAIL_SSL = bool(int(os.environ['EMAIL_SSL']))

SITE_URL = os.environ['SITE_URL']

DEFAULT_FROM_EMAIL = 'BASE Auth <noreply@bitclave.com>'
SUPPORT_EMAIL = 'noreply@bitclave.com'

EMAIL_IMGES_DIR = os.path.join(PROJECT_DIR, 'templates', 'mails', 'base', 'images')

GEOIP_PATH = os.path.join(BASE_DIR, 'data', 'geo-ip')

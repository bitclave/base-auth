import os

from .base import BASE_DIR, MIDDLEWARE

STATIC_URL = '/static/'

if 'AWS_STORAGE_BUCKET_NAME' in os.environ:
    AWS_STORAGE_BUCKET_NAME = os.environ['AWS_STORAGE_BUCKET_NAME']
    AWS_LOCATION = os.environ['AWS_LOCATION']
    AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
    AWS_S3_CUSTOM_DOMAIN = os.environ['AWS_S3_CUSTOM_DOMAIN']
    AWS_DEFAULT_ACL = 'public-read'
    AWS_IS_GZIPPED = True
    AWS_S3_FILE_OVERWRITE = True

    HEROKU_SLUG_COMMIT = os.environ['HEROKU_SLUG_COMMIT']

    STATICFILES_LOCATION = f'{AWS_LOCATION}-static/{HEROKU_SLUG_COMMIT}'
    STATICFILES_STORAGE = 'base_auth.site.storages.StaticStorage'

    MEDIAFILES_LOCATION = f'{AWS_LOCATION}-media'
    DEFAULT_FILE_STORAGE = 'base_auth.site.storages.MediaStorage'

    STATIC_ROOT = None
else:
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    STATICFILES_DIRS = (os.path.join(BASE_DIR, 'statics'), )
    MIDDLEWARE.insert(0, 'whitenoise.middleware.WhiteNoiseMiddleware')
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

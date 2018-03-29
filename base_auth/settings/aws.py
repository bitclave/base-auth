import os


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
    STATICFILES_STORAGE = 'base_auth.common.storages.StaticStorage'

    MEDIAFILES_LOCATION = f'{AWS_LOCATION}-media'
    DEFAULT_FILE_STORAGE = 'base_auth.common.storages.MediaStorage'

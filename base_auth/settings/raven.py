import os

RAVEN_CONFIG = {
    'dsn': os.environ['RAVEN_DSN'],
    'release': os.environ['HEROKU_SLUG_COMMIT'],
}

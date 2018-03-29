LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,

    'formatters': {
        'just_message': {
            'format': '%(message)s',
        },
        'verbose': {
            'format': '%(levelname)s [%(asctime)s] %(name)s [%(filename)s:%(lineno)d]: %(message)s',
            'datefmt': "%Y-%m-%d %H:%M:%S",
        },
    },

    'handlers': {
        'librato_custom_metric': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'just_message',
        },
        'sentry': {
            'level': 'WARNING',
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'null': {
            "class": 'logging.NullHandler',
        }
    },

    'loggers': {
        'librato': {
            'handlers': ['librato_custom_metric'],
            'level': 'INFO',
            'propagate': False,
        },
        'django': {
            'handlers': ['console', 'sentry'],
            'level': 'WARNING',
            'propagate': False,
        },
        'celery': {
            'handlers': ['console', 'sentry'],
            'level': 'WARNING',
            'propagate': False,
        },
        'raven': {
            'handlers': ['sentry'],
            'propagate': False,
        },
        'requests': {
            'handlers': ['null'],
            'propagate': False,
        }
    },

    'root': {
        'handlers': ['console', 'sentry'],
        'level': 'INFO',
    }
}

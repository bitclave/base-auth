import os

BROKER_URL = "{redis_dsl}/1".format(redis_dsl=os.environ['REDIS_URL'])
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_IGNORE_RESULT = True
CELERY_ALWAYS_EAGER = bool(int(os.getenv('CELERY_ALWAYS_EAGER', 0)))
CELERYD_TASK_SOFT_TIME_LIMIT = 60

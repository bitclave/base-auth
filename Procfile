release: python manage.py migrate & python manage.py collectstatic --noinput
web: gunicorn ads.wsgi --log-file -
worker: celery worker -A ads -l info
clock: python ads/clock.py

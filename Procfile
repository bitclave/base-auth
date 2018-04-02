release: python manage.py migrate & python manage.py collectstatic --noinput
web: gunicorn base_auth.wsgi --log-file -
worker: celery worker -A base_auth -l info
clock: python base_auth/clock.py

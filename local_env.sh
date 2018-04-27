#!/bin/bash

export DEBUG=1
export SECRET_KEY=secret_key

export DATABASE_URL=postgres://postgres@localhost:5432/base_auth
export REDIS_URL=redis://localhost:6379

export HOST=localhost
export SITE_URL=http://localhost:8000

export EMAIL_HOST=127.0.0.1
export EMAIL_PORT=1025
export EMAIL_USER=
export EMAIL_PASSWORD=
export EMAIL_SSL=0
export EMAIL_TSL=0

export SESSION_COOKIE_DOMAIN=localhost
export SESSION_COOKIE_SECURE=0

export RAVEN_DSN=

export HEROKU_SLUG_COMMIT=1

export CELERY_ALWAYS_EAGER=1

export BASE_NODE_URL=https://base2-bitclva-com.herokuapp.com/

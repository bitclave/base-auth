heroku_remotes:
	git remote add heroku_staging https://git.heroku.com/base-auth-staging.git

deploy_staging:
ifneq ($(shell git rev-parse --abbrev-ref HEAD),master)
	$(error Wrong branch)
else
	git push heroku_staging -f HEAD:master
endif

scss:
	scss ./base_auth/templates/style.scss:./statics/css/style.css --watch

js_prod:
	npm run build_prod

js_staging:
	npm run build_staging

js_dev:
	npm run build_dev

translate:
	./manage.py makemessages --all
	./manage.py compilemessages

clean:
	find . -name "*.pyc" -exec rm -f {} \;

heroku_buildpacks_prod:
	heroku labs:enable runtime-dyno-metadata --remote heroku_prod
	heroku buildpacks:clear --remote heroku_prod
	heroku buildpacks:set --remote heroku_prod --index 1 https://github.com/piotras/heroku-buildpack-gettext.git
	heroku buildpacks:set --remote heroku_prod --index 2 heroku/ruby
	heroku buildpacks:set --remote heroku_prod --index 3 heroku/python

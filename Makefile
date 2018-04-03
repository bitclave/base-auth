heroku_remotes:
	git remote add heroku_prod https://git.heroku.com/base-auth-bitclave-com.git

deploy_prod:
ifneq ($(shell git rev-parse --abbrev-ref HEAD),master)
	$(error Wrong branch)
else
	git push heroku_prod -f HEAD:master
endif

scss:
	scss ./base_auth/templates/style.scss:./statics/css/style.css --watch

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

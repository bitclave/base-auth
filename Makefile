base_client_js_url = git@github.com:bitclave/base-client-js.git
base_client_js_dir = /tmp/base-client-js

postinstall: update_base_client_js
	rm -rf ./node_modules/bitcore-ecies/node_modules/bitcore-lib
	rm -rf ./node_modules/bitcore-message/node_modules/bitcore-lib

update_base_client_js:
	git -C $(base_client_js_dir) pull || git clone --depth 1 --branch develop $(base_client_js_url) $(base_client_js_dir)
	npm install $(base_client_js_dir)/example/public/base-lib/bitclave-base
	rm -rf $(base_client_js_dir)

build_js_staging:
	npm run build_staging

build_js_dev:
	npm run build_dev

scss:
	scss ./base_auth/templates/style.scss:./statics/css/style.css --watch

clean:
	find . -name "*.pyc" -exec rm -f {} \;

translate:
	./manage.py makemessages --all
	./manage.py compilemessages

heroku_remotes:
	git remote add heroku_staging https://git.heroku.com/base-auth-staging.git

heroku_buildpacks_prod:
	heroku labs:enable runtime-dyno-metadata --remote heroku_prod
	heroku buildpacks:clear --remote heroku_prod
	heroku buildpacks:set --remote heroku_prod --index 1 https://github.com/piotras/heroku-buildpack-gettext.git
	heroku buildpacks:set --remote heroku_prod --index 2 heroku/ruby
	heroku buildpacks:set --remote heroku_prod --index 3 heroku/python

deploy_staging:
ifneq ($(shell git rev-parse --abbrev-ref HEAD),master)
	$(error Wrong branch)
else
	git push heroku_staging -f HEAD:master
endif

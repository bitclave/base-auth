base-auth
=========


Heroku Deployment
-----------------

Install additional buildpacks to compile `*.scss` and `*.mo`:

    make heroku_buildpacks

Notice that:

- Already installed buildpacks will be removed
- The order of the buidpacks matters

See: [pre_compile script](bin/pre_compile), [post_compile script](bin/post_compile).


Optional static type checking
-----------------------------

    mypy base_auth

See: [mypy](http://mypy-lang.org/), [config](mypy.ini)

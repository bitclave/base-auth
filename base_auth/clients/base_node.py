import os.path

from django.conf import settings
from py_mini_racer import py_mini_racer


def base_client_js():
    with open(os.path.join(settings.BASE_DIR, 'base-client-js', 'stubs.js')) as fh:
        stubs_js = fh.read()

    with open(os.path.join(settings.BASE_DIR, 'base-client-js', 'Base.js')) as fh:
        base_js = fh.read()

    with open(os.path.join(settings.BASE_DIR, 'base-client-js', 'wrapper.js')) as fh:
        wrapper_js = fh.read()

    ctx = py_mini_racer.MiniRacer()
    ctx.eval(stubs_js)
    ctx.eval(base_js)
    ctx.eval(wrapper_js)
    return ctx

def get_new_mnemonic():
    return base_client_js().call('BASENodeGetNewMnemonic')

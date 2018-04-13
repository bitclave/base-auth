import os.path

import execjs
import execjs.runtime_names
from django.conf import settings


def base_client_js():
    with open(os.path.join(settings.BASE_DIR, 'base-client-js', 'stubs.js')) as fh:
        stubs_js = fh.read()

    with open(os.path.join(settings.BASE_DIR, 'base-client-js', 'Base.node.js')) as fh:
        base_js = fh.read()

    with open(os.path.join(settings.BASE_DIR, 'base-client-js', 'wrapper.js')) as fh:
        wrapper_js = fh.read()

    runtime = execjs.get(execjs.runtime_names.Node)
    return runtime.compile('\n'.join([base_js, wrapper_js]))


def get_new_mnemonic():
    return base_client_js().call('BASENodeGetNewMnemonic')

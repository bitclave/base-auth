import json
import random
import string
from collections import OrderedDict
from datetime import datetime, timedelta
from typing import Any, Dict, Iterable, Tuple

from base_client.client import BASEClient
from base_client.encryption import encrypt_message
from base_client.key_derivation import PublicKey, derive_keypair, pbkdf2
from base_client.signatures import Signer, Verifier
from django.conf import settings
from django.utils import timezone

from base_auth.clients.jsonrpc import JSONRPC


class BASELoginPasswordAuth:
    PEPPER = settings.SECRET_MNEMONIC_DERIVATION_PEPPER
    BASE_NODE_URL = settings.BASE_NODE_URL
    BASE_SIGNER_URL = settings.BASE_SIGNER_URL
    BASE_SIGNER_PUBLIC_KEY = settings.BASE_SIGNER_PUBLIC_KEY

    def __init__(self, application_public_key: str, application_origin: str,
                 user_permissions: Iterable[str], login: str, password: str) -> None:
        self.application_public_key = application_public_key
        self.application_origin = application_origin
        self.verification_message = ''.join(random.sample(string.ascii_letters, 32))
        self.user_permissions = user_permissions
        self.login = login
        self.password = password

        self.mnemonic = pbkdf2(''.join([self.login, self.password, self.PEPPER]), 256)
        self.keypair = derive_keypair(self.mnemonic)
        self.access_token = self._generate_access_token()
        self.expiration_date = timezone.now() + timedelta(days=30)

        self.base_client = BASEClient(self.BASE_NODE_URL)
        self.base_signer_rpc = JSONRPC(self.BASE_SIGNER_URL)

    def authenticate(self) -> Tuple[str, str, datetime]:
        auth_response = self.base_client.create_account(self.mnemonic, self.verification_message)
        if not auth_response.ok:
            raise RuntimeError('Failure during negotiation with BASE Node')

        auth_json = auth_response.json()
        verifier = Verifier(PublicKey.from_hex_compressed(auth_json['publicKey']))

        if not verifier.verify_raw(auth_json['message'], auth_json['sig']):
            raise RuntimeError('Signature mismatch')

        grant_access_response = self.base_client.grant_access_for_client(
            self.mnemonic, self.application_public_key, self.user_permissions)
        if not grant_access_response.ok:
            raise RuntimeError('Failure during negotiation with BASE Node')

        self._notify_signer()

        return self.keypair.public_key.hex_compressed, self.access_token, self.expiration_date

    def _generate_access_token(self) -> str:
        access_token = ''.join(random.sample(''.join([string.ascii_letters, string.digits]), 32))
        signer = Signer(self.keypair.private_key)

        return access_token + signer.sign_raw(access_token)

    def _notify_signer(self) -> None:
        payload: Dict[str, Any] = OrderedDict()
        payload['passPhrase'] = self.mnemonic
        payload['accessToken'] = self.access_token
        payload['origin'] = self.application_origin
        payload['expireDate'] = self.expiration_date.isoformat()
        payload['permissions'] = list(self.user_permissions)

        payload_json = json.dumps(payload)
        payload_encrypted = encrypt_message(
            self.keypair.private_key,
            PublicKey.from_hex_compressed(self.BASE_SIGNER_PUBLIC_KEY),
            payload_json,
        )

        self.base_signer_rpc('signMessage', payload_encrypted)

import json
from typing import Any, Dict, Iterable

import requests


class JSONRPCError(Exception):
    pass


class JSONRPC:
    version = '2.0'

    def __init__(self, url: str) -> None:
        self.current_call_id = 0
        self.url = url

    def __call__(self, method: str, *args: Iterable[Any]) -> Dict[str, Any]:
        self.current_call_id += 1

        response = requests.post(
            self.url,
            json={
                'jsonrpc': self.version,
                'method': method,
                'params': list(args),
                'id': self.current_call_id
            })

        try:
            return response.json()
        except json.JSONDecodeError:
            raise JSONRPCError(f'Status {response.status_code}. Body: {response.text}')

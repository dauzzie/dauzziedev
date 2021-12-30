import requests
import json
import functools
import urllib.parse as urlparse
import base64

# ACCESS TOKEN
CLIENT_ID = "488ee242e0fa4f33806e217467ba8501"
CLIENT_SECRET = "9a6531be5ada4de0afa163a63bc24b2f"
AUTH_URL = "https://accounts.spotify.com/authorize?"
TOKEN_URL = "https://accounts.spotify.com/api/token"
REDIRECT_URI = "http://localhost:3000"


def _access_token_call(api_args : dict) -> requests.Response:
    api_args['client_id'] = CLIENT_ID
    api_args['scope'] = _access_token_scope()
    api_args['redirect_uri'] = urlparse.quote_plus(REDIRECT_URI)
    url = AUTH_URL + "&".join(f'{k}={v}' for k,v in api_args.items())

    print('GET', url)

    resp = requests.get(url)
    resp.raise_for_status()
    return resp


def _access_token_scope() -> str:
    scopes = [
        'user-top-read',
        'user-read-currently-playing'
        ]
    return "%20".join(x for x in scopes)

def get_access_token() -> str:
    access_dict = {
        "response_type":"code",
        "state":"61912"
    }

    token = _access_token_call(access_dict)
    print(token)
    return token

def _refresh_token_call(code : str) -> requests.Response:
    refresh_args = {
        "grant_type":"authorization_code",
        "code":code,
        "redirect_uri": REDIRECT_URI
    }
    headers = {"Authorization": f"Basic {_refresh_token_header()}"}
    url = TOKEN_URL

    print("POST", url)

    resp = requests.post(url=TOKEN_URL, headers=headers, data=refresh_args)
    print(resp)
    return resp

def _refresh_token_header() -> str:
    message = f"{CLIENT_ID}:{CLIENT_SECRET}"
    base64bytes = base64.b64encode(message.encode('ascii'))
    base64message = base64bytes.decode('ascii')
    return base64message

def get_refresh_token(code:str) -> requests.Response:
    return _refresh_token_call(code)

res = get_refresh_token("AQCr54r_noYiLZDOydAFBPvn0RerbtkLwKKrnCBupall0iGz8TZcNpYyr-61uut5xBuLE5cMC5QiqbRlI_cD3opgbvEu3tyFGTXXKgroDt3dltsFrhBzGHlmGQuAj0-sBxUF0-yw_CzZ1kISXlLr2VzFYIfOaC7RLodgLS0HCTN8tTODEHuYWAnFQWzyGejFEs19HezD2wH5P258DTUCofESPmUR")
print(res.text)



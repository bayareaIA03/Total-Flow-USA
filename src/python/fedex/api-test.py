import requests
import json
import get_access_token
import os


get_home = os.environ.get("SHIPPO_HOME")
payload = open(os.path.join(get_home,'cred/fedex/payload.json'),'r')
url = "https://apis.fedex.com/rate/v1/rates/quotes"
token = get_access_token.get_access_token()
headers = {
    'Content-Type': "application/json",
    'X-locale': "en_US",
    'Authorization': "Bearer {}".format(token)
    }
print(headers)
response = requests.post(url, data=payload, headers=headers)

print(response.text)

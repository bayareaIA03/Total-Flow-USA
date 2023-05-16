import requests
import json
import os

def get_access_token():
  get_home = os.environ.get("SHIPPO_HOME")
  inputs = json.load(open(os.path.join(get_home,'cred','fedex','get_access_token.json'),'r'))
  url = "https://apis.fedex.com/oauth/token"

  payload = inputs # 'input' refers to JSON Payload
  headers = {
      'Content-Type': "application/x-www-form-urlencoded"
      }

  response = requests.request("POST", url, data=payload, headers=headers)
  print(response.text)
  access_token = json.loads(response.text)["access_token"]
  return access_token

if __name__=="__main__":
    print(get_access_token())

import requests

# set up the API endpoint URL
# url = 'https://wwwcie.ups.com/rest/Rate'
url = "https://onlinetools.ups.com/ship/v1/rating/Rate"
# set up the request headers
headers = {
    "Content-Type": "application/json",
    "AccessLicenseNumber": "7DCFDED8F2B34774",
    "Username": "totalflowmuffler",
    "Password": "AA85208520$a",
}
services = [
    {"Code": "01", "Description": "UPS_NEXT_DAY_AIR"},
    {"Code": "02", "Description": "UPS_2ND_DAY_AIR"},
    {"Code": "03", "Description": "UPS_GROUND"},
    {"Code": "07", "Description": "UPS_WORLDWIDE_EXPRESS"},
    {"Code": "08", "Description": "UPS_EXPEDITED"},
    {"Code": "12", "Description": "UPS_3_DAY_SELECT"},
    {"Code": "13", "Description": "UPS_NEXT_DAY_AIR_SAVER"},
    {"Code": "14", "Description": "UPS Next Day Air Early"},
    {"Code": "59", "Description": "UPS_2ND_DAY_AIR_AM"},
    {"Code": "65", "Description": "UPS_WORLDWIDE_EXPRESS_SAVER"},
    {"Code": "96", "Description": "UPS_EXPRESS_FREIGHT"},
    {"Code": "98", "Description": "UPS_EXPRESS_FREIGHT_MIDDAY"},
    {"Code": "96P", "Description": "UPS_EXPRESS_FREIGHT_PLUS"},
]

address_validation = requests.post(
    "https://onlinetools.ups.com/addressvalidation/v1/3",
    headers=headers,
    json={
        "XAVRequest": {
            "AddressKeyFormat": {
                "ConsigneeName": "Mr. President",
                "AddressLine": ["1775 PARK ST"],
                "PoliticalDivision2": "SELMA",
                "PoliticalDivision1": "CA",
                "PostcodePrimaryLow": "93662",
                "CountryCode": "US",
            }
        }
    },
)
sender_validated_address = address_validation.json()["XAVResponse"]["Candidate"][
    "AddressKeyFormat"
]


address_validation = requests.post(
    "https://onlinetools.ups.com/addressvalidation/v1/3",
    headers=headers,
    json={
        "XAVRequest": {
            "AddressKeyFormat": {
                "ConsigneeName": "Mr. President",
                "AddressLine": ["3242 Santa Susana Way"],
                "PoliticalDivision2": "Union City",
                "PoliticalDivision1": "CA",
                "PostcodePrimaryLow": "94587",
                "CountryCode": "US",
            }
        }
    },
)
receiver_validated_address = address_validation.json()["XAVResponse"]["Candidate"][
    "AddressKeyFormat"
]
# set up the request payload
payload = {
    "UPSSecurity": {
        "UsernameToken": {"Username": "totalflowmuffler", "Password": "AA85208520$a"},
        "ServiceAccessToken": {"AccessLicenseNumber": "7DCFDED8F2B34774"},
    },
    "RateRequest": {
        "Request": {
            "RequestOption": "Rate",
            "TransactionReference": {"CustomerContext": "GetRates"},
        },
        "Shipment": {
            "Shipper": {
                "Name": "TotalFlow",
                "ShipperNumber": "56Y3V3",
                "Address": {
                    "AddressLine": sender_validated_address["AddressLine"],
                    "City": sender_validated_address["PoliticalDivision2"],
                    "StateProvinceCode": sender_validated_address["PoliticalDivision1"],
                    "PostalCode": sender_validated_address["PostcodePrimaryLow"],
                    "CountryCode": "US",
                },
            },
            "ShipTo": {
                "Name": "Recipient Name",
                "Address": {
                    "AddressLine": receiver_validated_address["AddressLine"],
                    "City": receiver_validated_address["PoliticalDivision2"],
                    "StateProvinceCode": receiver_validated_address[
                        "PoliticalDivision1"
                    ],
                    "PostalCode": receiver_validated_address["PostcodePrimaryLow"],
                    "CountryCode": "US",
                },
            },
            "ShipFrom": {
                "Name": "Your Name",
                "Address": {
                    "AddressLine": sender_validated_address["AddressLine"],
                    "City": sender_validated_address["PoliticalDivision2"],
                    "StateProvinceCode": sender_validated_address["PoliticalDivision1"],
                    "PostalCode": sender_validated_address["PostcodePrimaryLow"],
                    "CountryCode": "US",
                },
            },
            "Package": {
                "PackagingType": {"Code": "02", "Description": "Rate"},
                "Dimensions": {
                    "UnitOfMeasurement": {"Code": "IN", "Description": "Inches"},
                    "Length": "10",
                    "Width": "8",
                    "Height": "12",
                },
                "PackageWeight": {
                    "UnitOfMeasurement": {"Code": "LBS", "Description": "Pounds"},
                    "Weight": "7",
                },
            },
            "ShipmentRatingOptions": {"NegotiatedRatesIndicator": "1"},
            "Service": {},
        },
    },
}

# make the API request
for service in services:
    payload["RateRequest"]["Shipment"]["Service"] = service
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        continue
    # print the response content
    print(
        service["Description"],
        ":",
        response.json()["RateResponse"]["RatedShipment"]["NegotiatedRateCharges"][
            "TotalCharge"
        ]["MonetaryValue"],
    )
    print(response.text)
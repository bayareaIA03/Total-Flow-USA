const fs = require('fs');
const qs = require('qs');
const axios = require('axios');
const app_user_info = require('../fedex/app.js');
const { rate_class, rate_data } = require('../rateClass.js');

const headers = {
    'Content-Type': 'application/json',
    'AccessLicenseNumber': '',
    'Username': '',
    'Password': ''
  };

  const services = [
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
  ];

async function getRates(user_info={}){
    // const auth_json = JSON.parse(fs.readFileSync(process.env.SHIPPO_HOME+'/cred/ups/get_access_token.json'));
    var sender_addr_valid_payload = JSON.parse(fs.readFileSync(process.env.SHIPPO_HOME+'/cred/ups/address_valid_payload.json'));
    var receiver_addr_valid_payload= JSON.parse(fs.readFileSync(process.env.SHIPPO_HOME+'/cred/ups/address_valid_payload.json'));
    var rate_payload= JSON.parse(fs.readFileSync(process.env.SHIPPO_HOME+'/cred/ups/rate_payload.json'));

    sender_addr_valid_payload.XAVRequest.AddressKeyFormat.AddressLine[0]= user_info.sender_address;
    sender_addr_valid_payload.XAVRequest.AddressKeyFormat.PoliticalDivision1 = user_info.sender_state;
    sender_addr_valid_payload.XAVRequest.AddressKeyFormat.PostcodePrimaryLow = user_info.sender_postalCode;
    sender_addr_valid_payload.XAVRequest.AddressKeyFormat.CountryCode = user_info.sender_country;

    receiver_addr_valid_payload.XAVRequest.AddressKeyFormat.AddressLine[0]= user_info.sender_address;
    receiver_addr_valid_payload.XAVRequest.AddressKeyFormat.PoliticalDivision1 = user_info.sender_state;
    receiver_addr_valid_payload.XAVRequest.AddressKeyFormat.PostcodePrimaryLow = user_info.sender_postalCode;
    receiver_addr_valid_payload.XAVRequest.AddressKeyFormat.CountryCode = user_info.sender_country;

    var new_user_info = await update_object(sender_addr_valid_payload,receiver_addr_valid_payload,app_user_info);
    var rates = ups_rate_payload(new_user_info,rate_payload,user_info)
    return rates;
}

async function validateAddress(addr_valid_payload={}){


    const url = 'https://onlinetools.ups.com/addressvalidation/v1/3';
    var validated_address;
    
    await axios.post(url, addr_valid_payload, { headers: headers })
    .then(response => {
        validated_address = response.data.XAVResponse.Candidate.AddressKeyFormat;

        let words = validated_address.AddressLine.toLowerCase().split(" ");
        for (let i = 0; i < words.length; i++) {
          words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
        validated_address.AddressLine = words.join(" ");
       
      
    })
    .catch(error => {
      console.error(error);
    });
    return validated_address;
}

async function update_object(payload_sender={}, payload_receiver={}, user_info={}) {
    var output = user_info;

    var temp_validate_address = await validateAddress(payload_sender);

    output.sender_address = temp_validate_address.AddressLine
    output.sender_state = temp_validate_address.PoliticalDivision1
    output.sender_postalCode = temp_validate_address.PostcodePrimaryLow 
    output.sender_country = temp_validate_address.CountryCode 
    output.sender_weight = user_info.sender_weight;

    var temp = await validateAddress(payload_receiver);

    output.receiver_address = temp.AddressLine
    output.receiver_state = temp.PoliticalDivision1
    output.receiver_postalCode = temp.PostcodePrimaryLow 
    output.receiver_country = temp.CountryCode 

    return output;
  }

async function ups_rate_payload(new_user_info={},rate_payload={},user_info={}){

    //shipper
    rate_payload.RateRequest.Shipment.Shipper.Address.AddressLine=new_user_info.sender_address
    rate_payload.RateRequest.Shipment.Shipper.Address.PostalCode = new_user_info.sender_postalCode
    rate_payload.RateRequest.Shipment.Shipper.Address.StateProvinceCode = new_user_info.sender_state
    rate_payload.RateRequest.Shipment.Shipper.Address.CountryCode = new_user_info.sender_country

    rate_payload.RateRequest.Shipment.Package.Dimensions.Length= user_info.sender_length
    rate_payload.RateRequest.Shipment.Package.Dimensions.Height= user_info.sender_height
    rate_payload.RateRequest.Shipment.Package.Dimensions.Width= user_info.sender_width
    rate_payload.RateRequest.Shipment.Package.PackageWeight.Weight = user_info.sender_weight;
    
    //shipto
    rate_payload.RateRequest.Shipment.ShipTo.Address.AddressLine=new_user_info.receiver_address
    rate_payload.RateRequest.Shipment.ShipTo.Address.PostalCode = new_user_info.receiver_postalCode
    rate_payload.RateRequest.Shipment.ShipTo.Address.StateProvinceCode = new_user_info.receiver_state
    rate_payload.RateRequest.Shipment.ShipTo.Address.CountryCode = new_user_info.receiver_country
    //shipfrom
    rate_payload.RateRequest.Shipment.ShipFrom.Address.AddressLine=new_user_info.sender_address
    rate_payload.RateRequest.Shipment.ShipFrom.Address.PostalCode = new_user_info.sender_postalCode
    rate_payload.RateRequest.Shipment.ShipFrom.Address.StateProvinceCode = new_user_info.sender_state
    rate_payload.RateRequest.Shipment.ShipFrom.Address.CountryCode = new_user_info.sender_country


      var outputFilename = process.env.SHIPPO_HOME +'/output/prettyJSONups.json';
      fs.writeFile(outputFilename,"", function(err) {
      });

      // Process the response from rate calculation
      var rate_list = []
      for (let i = 0; i < services.length; i++) {
        rate_payload.RateRequest.Shipment.Service = services[i];
        const response = await fetch("https://onlinetools.ups.com/ship/v1/rating/Rate", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(rate_payload)
        });
        if (response.status !== 200) {
          //console.log("not working")
          continue;
        }

        
        const data = await response.json();
        fs.appendFile(outputFilename,JSON.stringify(data,null,'\t'), function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("Payload rate saved to " + outputFilename);
          }
        }); 

        let service_name = services[i].Description
        let total_cost = data.RateResponse.RatedShipment.NegotiatedRateCharges.TotalCharge.MonetaryValue
        let day_offset = 0;
        let delivery_time = "End of day";
        if (data.RateResponse.RatedShipment.GuaranteedDelivery && data.RateResponse.RatedShipment.GuaranteedDelivery.BusinessDaysInTransit)
        {
          day_offset = parseInt(data.RateResponse.RatedShipment.GuaranteedDelivery.BusinessDaysInTransit);
          if (data.RateResponse.RatedShipment.GuaranteedDelivery.DeliveryByTime)
          {
            delivery_time = data.RateResponse.RatedShipment.GuaranteedDelivery.DeliveryByTime;
          }
          console.log(day_offset);
        }
        else {
          day_offset = 3;
        }
        let commit_date = new Date(response.headers.get('date'));
        commit_date.setDate(commit_date.getDate() + day_offset);
        
        let commit_day = commit_date.toLocaleDateString('en-US', { weekday: 'short' });

        let commit_day_print = commit_date.getFullYear().toString() + "-" + (commit_date.getMonth() + 1).toString() + "-" + commit_date.getDate().toString() + "     " + delivery_time;
        var rate_object_ups = new rate_data(service_name, total_cost, commit_day_print, commit_day);
        var rate_object = new rate_class(rate_object_ups);
  
        rate_list.push(rate_object);

    }

    write_to_rate_payload(rate_payload);
    // fix this part so it returns service_name, cost, date, day,
    return rate_list;
}

  function write_to_rate_payload(rate_payload={}){
    var outputFilename = process.env.SHIPPO_HOME +'/cred/ups/rate_payload.json';
    fs.writeFile(outputFilename, JSON.stringify(rate_payload), (err) => {
        if (err) throw err;
        console.log('UPS payload rate written to '+ outputFilename);
      });
  }

  module.exports = {
    getRates
};


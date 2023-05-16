const fs = require('fs');
const qs = require('qs');
const axios = require('axios');
const { rate_class, rate_data } = require('../rateClass.js');

var fedexAccessToken = null;


 async function startFedexAuth(){
    
    const auth_json = JSON.parse(fs.readFileSync(process.env.SHIPPO_HOME+'/cred/fedex/get_access_token.json'));
    var head = {
      method: 'POST',
      url: 'https://apis.fedex.com/oauth/token',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: qs.stringify(auth_json)
    };
 
    try {
      var resp = await axios.request(head);
      fedexAccessToken = resp.data.access_token;
    } catch (err){
      console.error(err);
    }
    
  }
  
   async function getRates(user_info={}){

    
    await startFedexAuth();
    var payload_json = JSON.parse(fs.readFileSync(process.env.SHIPPO_HOME+'/cred/fedex/payload.json'));
    json_update(payload_json,user_info) 
    
    fs.writeFileSync(process.env.SHIPPO_HOME+'/cred/fedex/payload.json', JSON.stringify(payload_json));

    var head = {
      method: 'POST',
      url: 'https://apis.fedex.com/rate/v1/rates/quotes',
      headers: {
        'content-type': 'application/json',
        'X-locale': 'en_US',
        'Authorization': `Bearer ${fedexAccessToken}`
      },
      data: JSON.stringify(payload_json)
    };
    
    try {
       const resp = await axios.request(head);
  
      var outputFilename = process.env.SHIPPO_HOME +'/output/prettyJSONfedex.json';
      fs.writeFile(outputFilename,JSON.stringify(resp.data.output,null,'\t'), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("Payload rate saved to " + outputFilename);
        }
      }); 
     
      var rate_list = []
      for(var i = 0;i<resp.data.output.rateReplyDetails.length;i++){
         let commit_date = resp.data.output.rateReplyDetails[i].commit.dateDetail.dayFormat;
         let commit_day = resp.data.output.rateReplyDetails[i].commit.dateDetail.dayOfWeek;
         let service_name = resp.data.output.rateReplyDetails[i].serviceName;
         let total_cost = resp.data.output.rateReplyDetails[i].ratedShipmentDetails[0].totalNetCharge;
     
         var rate_object_fedex = new rate_data(service_name, total_cost, commit_date.replace("T"," "), commit_day);
         var rate_object = new rate_class(rate_object_fedex);
  
         console.log(commit_date+" "+commit_day+" "+service_name+" "+
         total_cost)
         rate_list.push(rate_object);
        }

    } catch (err){
      console.error(err);
    }
  return rate_list;
  } 

  function json_update(payload_json={},user_info={}) {
    payload_json.requestedShipment.shipper.address.streetLines[0] = user_info.sender_address;
    payload_json.requestedShipment.shipper.address.stateOrProvinceCode = user_info.sender_state;
    payload_json.requestedShipment.shipper.address.postalCode = user_info.sender_postalCode;
    payload_json.requestedShipment.shipper.address.countryCode = user_info.sender_country;
    payload_json.requestedShipment.requestedPackageLineItems[0].dimensions.length = user_info.sender_length
    payload_json.requestedShipment.requestedPackageLineItems[0].dimensions.width = user_info.sender_width
    payload_json.requestedShipment.requestedPackageLineItems[0].dimensions.height = user_info.sender_height
    payload_json.requestedShipment.requestedPackageLineItems[0].weight.value = user_info.sender_weight;

    payload_json.requestedShipment.recipient.address.streetLines[0] = user_info.receiver_address;
    payload_json.requestedShipment.recipient.address.stateOrProvinceCode = user_info.receiver_state;
    payload_json.requestedShipment.recipient.address.postalCode = user_info.receiver_postalCode;
    payload_json.requestedShipment.recipient.address.countryCode= user_info.receiver_country;
    payload_json.requestedShipment.recipient.address.residential = user_info.receiver_residential;
  }
    module.exports = {
        getRates
    };
  
      
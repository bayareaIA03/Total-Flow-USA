const port = 8080;
const express  = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const qs = require('qs');
var axios = require("axios").default;
const mysql = require('mysql');
var fedexAccessToken = null;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'totalflowusa',
  port: '3306'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});



app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use('/', express.static(__dirname + '/'));

app.listen(port, function() {
    try {    
      console.log("Serving")
    } catch (err) {
        console.error(err);
      }
   
});

// when go to website, this function will send the web server the html file
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/shippo.html");
    console.log("File Sent");
});

app.post("/submit", function(req, res) {
    res.send(`${req.body.Name} ${req.body.address1}`)
})

async function startFedexAuth(){
  const fileName = JSON.parse(fs.readFileSync('get_access_token.json'));
  var head = {
    method: 'POST',
    url: 'https://apis.fedex.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(fileName)
  };

  try {
    var resp = await axios.request(head);
    fedexAccessToken = resp.data.access_token;
  } catch (err){
    console.error(err);
  }
}

async function getRates(){
  await startFedexAuth();
  console.log(fedexAccessToken);
  const fileName = JSON.parse(fs.readFileSync('payload.json'));
  var head = {
    method: 'POST',
    url: 'https://apis.fedex.com/rate/v1/rates/quotes',
    headers: {
      'content-type': 'application/json',
      'X-locale': 'en_US',
      'Authorization': `Bearer ${fedexAccessToken}`
    },
    data: JSON.stringify(fileName)
  };
  
  try {
    const resp = await axios.request(head);
 
    outputFilename = __dirname + '/prettyJSON.json';
    fs.writeFile(outputFilename,JSON.stringify(resp.data.output,null,'\t'), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
    }); 

    for(var i = 0;i<resp.data.output.rateReplyDetails.length;i++){

      var service_name = resp.data.output.rateReplyDetails[i].serviceName;
      var net_charge = resp.data.output.rateReplyDetails[i].ratedShipmentDetails[0].totalNetCharge;
      var total_cost = resp.data.output.rateReplyDetails[i].ratedShipmentDetails[0].totalNetFedExCharge
      var fuel_cost = resp.data.output.rateReplyDetails[i].ratedShipmentDetails[0].shipmentRateDetail.surCharges[0].amount

    // insertion and deletion to database
    //   var sql = "INSERT INTO cost (service_name,total_net_cost, total_cost,fuel_cost) VALUES ('"+service_name+"','"+net_charge+"','"+total_cost+"','"+fuel_cost+"')";
    //   connection.query(sql, function (err, result) {
    //       if (err) {
    //           console.error(err);
    //           return;
    //       }
    //       console.log("insert worked");
    //   });
     }
    // var sql = "DELETE FROM cost";
    // connection.query(sql, function (err, result) {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    //     console.log("deletion worked");
    // });

    
  } catch (err){
    console.error(err);
  }

}

getRates();

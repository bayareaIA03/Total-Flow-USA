const fs = require("fs");
const express = require('express');
const fedex = require('./fedexAPI.js');
const ups = require('../ups/upsAPI.js');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
app.use(express.static(process.env.SHIPPO_HOME+"/src/gui/")); //this gives frontend the files to fetch
const nunjucks = require('nunjucks');
nunjucks.configure(process.env.SHIPPO_HOME + "/src/gui",{ autoescape: true });
const template = fs.readFileSync(process.env.SHIPPO_HOME + '/src/gui/prices.html', 'utf8');


app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use('/', express.static(process.env.SHIPPO_HOME + '/'));

app.listen(port, function() {
    try {    
      console.log("Serving")
    } catch (err) {
        console.error(err);
      }
   
});

// when go to website, this function will send the web server the html file
app.get("/", function(req, res) {
    res.sendFile(process.env.SHIPPO_HOME + "/src/gui/shippo.html");
});

app.post("/submit", async(req, res) => {
  var user_info = {
    sender_address: req.body.address1,
    sender_country: req.body.country_code1, 
    sender_state: req.body.state_code1,
    sender_postalCode: req.body.zip1,
    sender_height: req.body.package_height,
    sender_length: req.body.package_length,
    sender_width: req.body.package_width,
    sender_weight: req.body.package_weight,

    receiver_address: req.body.address2,
    receiver_country: req.body.country_code2, 
    receiver_state: req.body.state_code2,
    receiver_postalCode: req.body.zip2,
    receiver_residential:req.body.residential
  };

  var fedex_rates = await fedex.getRates(user_info);
  var ups_rates = await ups.getRates(user_info);

  var rates = {
    fedex: fedex_rates,
    ups: ups_rates
  };

  var website = nunjucks.renderString(template,{rates:rates}); 
  
  res.send(website);

  module.exports = user_info ;
})





       class rate_class {
        constructor(shipping_rate_data)
        {
          this.company = shipping_rate_data;
        } 
      };

       class rate_data {
        constructor (service_name,cost, date, day) {
        this.service_name = service_name;
        this.cost = cost;
        this.date = date;
        this.day = day;
        }
      };

      module.exports = {
        rate_class: rate_class,
        rate_data: rate_data
      };
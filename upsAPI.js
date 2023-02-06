const upsApi = require("ups-api");

// instance the API client with defaults
const api = new upsApi.API({
    username: "myupsaccount",
    password: "myupsaccountpassword",
    license: "3F9955C3F789C255"
});
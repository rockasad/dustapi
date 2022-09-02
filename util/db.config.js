const mysql = require("mysql");
const db = mysql.createPool({
    host: "dns.pkbit.co",
    user: "komkawila",
    password: "Kkomprwm20_1111",
    database: "dustsystem_db",
    timezone:"UTC"
});

module.exports = db;
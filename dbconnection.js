const pgp = require("pg-promise")();
module.exports = pgp("postgres://admin:nepal123@127.0.0.1:5433/api");

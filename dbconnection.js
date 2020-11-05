//database connection
const pgp = require("pg-promise")();
module.exports = pgp("postgres://postgres:xivee*8520@127.0.0.1:5433/api");

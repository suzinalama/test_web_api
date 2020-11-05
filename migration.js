const db = require("./dbconnection");
let sqlForMembers = `CREATE TABLE IF NOT EXISTS members(
  id serial PRIMARY KEY NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  addedby BIGINT NOT NULL,
  FOREIGN KEY (addedby) References alluser(id)
)`;
let sqlForAllUsers = `
CREATE TABLE IF NOT EXISTS alluser(
	id serial NOT NULL PRIMARY KEY,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	pass VARCHAR(255) NOT NULL
)
`;

db.any(sqlForMembers).then((result) => {
  console.log("Success creating table members");
});
db.any(sqlForAllUsers).then((result) => {
  console.log("Success creating table alluser");
});

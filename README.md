# WEB API
This is a small web api built using NodeJs, Express framework and postgresql database. The user can be able to register/login into the system. The user can be able to view and edit information. The user can be able to add members details and add, edit, delete and view members details. 

For the authentication of the user, JSON Web Token(JWT) which is an open standard that defines a self-contained and compact way to securely tranmistting the information betwwen the parties as JSON object has been used. Signed tokens can verify the integrity of the claims contained within it, while encrypted tokens hide those claims from other parties. When tokens are signed using public/private key pairs, the signature also certifies that only the party holding the private key is the one that signed it. Thus, this makes sure that authentication is secure and members details created by that specific user can only by viewed, added, edited and deleted by that particular user.

For the security, bcryptjs has been used to hash the password whereas pg-promise which is the PostgreSQL interface for Node.js has been used to create automatic database connection.


## Database Setup
Create new server. Create new database called api.
1. `node migration.js` when running the js file the tables get created automatically

## Getting started
- `npm run dev` opens local interface at http://localhost:3000/

This Web api has been tested using Postman.
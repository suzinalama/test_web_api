const router = require("express").Router();
const db = require("./dbconnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authguard = require("./middleware/authguard");
/**
 * method : POST
 * url : /register
 */
router.post("/register", async (req, res, next) => {
  try {
    let hashPassword = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );
    let data = await db.any(
      "SELECT * FROM alluser WHERE email = $1",
      req.body.email
    );
    if (data.length > 0) {
      return res.json({ message: "Registered using same email" });
    }
    await db.any(
      "INSERT INTO alluser(firstName , lastName , email , pass) VALUES($<firstName> , $<lastName>, $<email> , $<password>);",
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
      }
    );
    res.json({ error: false, message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
  }
});
/**
 * method : POST
 * url : /login
 */
router.post("/login", async (req, res, next) => {
  let data = await db.any(
    "SELECT * FROM alluser WHERE email = $1",
    req.body.email
  );
  if (data.length > 0) {
    data = data[0];
    if (bcrypt.compareSync(req.body.password, data.pass)) {
      let token = jwt.sign({ data: data }, "asdfjsadkfjaslkfjasfasdfh");
      return res.json({ token: token, error: false });
    } else {
      return res.json({ message: "Not authenticated", error: true });
    }
  }
});
/**
 * method : GET
 * url : /getDetails
 */
router.get("/getDetails", authguard, async (req, res, next) => {
  let email = req.authUserData.email;
  let data = await db.one("SELECT * FROM alluser WHERE email = $1", email);
  delete data.pass;
  res.json(data);
});
/**
 * method : PUT
 * url : /updateDetails
 */
router.put("/updateDetails/:id", authguard, async (req, res, next) => {
  let data = await db.any("SELECT * FROM alluser WHERE id = $1", req.params.id);
  if (!data.length) {
    return res.json({ message: "No data to update" });
  }
  data = data[0];
  let dataToUpdate = {
    firstname: req.body.firstname ? req.body.firstname : data.firstname,
    lastname: req.body.lastname ? req.body.lastname : data.lastname,
    email: req.body.email ? req.body.email : data.email,
  };
  await db.any(
    "UPDATE alluser SET firstname = $<firstname> , lastname = $<lastname> , email = $<email>",
    dataToUpdate
  );
  res.json({ message: "Successfully updated" });
});


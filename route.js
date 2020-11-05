const router = require("express").Router();
const db = require("./dbconnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authguard = require("./middleware/authguard");
/**
 * method : POST
 * url : /register
 * to register new user
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
      return res.json({ message: "Already registered using same email" });
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
 * to login as the existing user
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
 * to view existing user details
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
 * to update user details
 */
router.put("/updateDetails/:id", authguard, async (req, res, next) => {
  if (req.params.id != req.authUserData.id) {
    return res.json({ message: "Cannot update another user details" });
  }
  let data = await db.any("SELECT * FROM alluser WHERE id = $1", req.params.id);
  if (!data.length) {
    return res.json({ message: "No data found to update" });
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
  res.json({ message: "updated" });
});
/**
 * method : POST
 * url : /addmember
 * to add new member by the user
 */
router.post("/addMember", authguard, async (req, res, next) => {
  let addedBy = req.authUserData.id;
  await db.any(
    "INSERT INTO members(firstname , lastname , address , phone, email , addedBy) VALUES($<firstname> , $<lastname>, $<address>, $<phone>, $<email> , $<addedby>);",
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      addedby: addedBy,
    }
  );
  res.json({ error: null, message: "Added new member successfully" });
});
/**
 * method : PUT
 * url : /updateMember/:id
 * to update members details by its user
 */
router.put("/updateMember/:id", authguard, async (req, res, next) => {
  let data = await db.any(
    "SELECT * FROM members WHERE id = $1 AND addedby = $2 ",
    [req.params.id, req.authUserData.id]
  );
  if (!data.length) {
    return res.json({
      message: "Cannot update another user member's data",
      error: true,
    });
  }
  data = data[0];
  let dataToUpdate = {
    firstname: req.body.firstname ? req.body.firstname : data.firstname,
    lastname: req.body.lastname ? req.body.lastname : data.lastname,
    address: req.body.address ? req.body.address : data.address,
    phone: req.body.phone ? req.body.phone : data.phone,
    email: req.body.email ? req.body.email : data.email,
  };
  await db.any(
    "UPDATE members SET firstname = $<firstname> , lastname = $<lastname> , address = $<address> , phone = $<phone>, email = $<email>",
    dataToUpdate
  );
  res.json({ message: "Updated successfully", error: null });
});
/**
 * method : DELETE
 * url : /deleteMember/:id
 * to delete member by the user
 */
router.delete("/deleteMembers/:id", authguard, async (req, res, next) => {
  let data = await db.any(
    "SELECT * FROM members WHERE id = $1 AND addedby = $2 ",
    [req.params.id, req.authUserData.id]
  );
  if (!data.length) {
    return res.json({
      error: true,
      message: "Cannot delete another user's data",
    });
  }
  await db.any("DELETE FROM members WHERE id = $1 ", req.params.id);
  res.json({ message: "Deleted successfully", error: null });
});
/**
 * method : DELETE
 * url : /getAllMembers
 * to get all the members details of the specific user
 */
router.get("/getAllMembers", authguard, async (req, res, next) => {
  let data = await db.any(
    "SELECT * FROM members WHERE addedby = $1 ",
    req.authUserData.id
  );
  res.json({ data: data, error: null });
});
module.exports = router;

const express = require("express");
const db = require("../model/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const router = express.Router();

//localhost:5000/signup
router.post("/signup", async (req, res) => {
  const { name, email, pno, password, mode } = req.body;

  if (!name || !email || !pno || !password || !mode) {
    return res.json({ error: "Please Add All the Fields" });
  } else {
    try {
      let encrypted = await bcrypt.hash(password, 10);
      const user = { name, email, phone: pno, password: encrypted, mode };
      let sql = "INSERT INTO `users` SET ?";
      db.query(sql, user, (err, result) => {
        if (err) {
          return res.json({ error: err.sqlMessage });
        } else {
          return res.json({ msg: "User Added Succesfully" });
        }
      });
    } catch (error) {
      return res.json({ error: error });
    }
  }
});

//login
router.post("/signin", (req, res) => {
  const { email, password, mode } = req.body;
  //   console.log(req.body);
  if (!email || !password || !mode) {
    return res.json({ error: "please add email and password" });
  }
  let sql = `SELECT * FROM  users where email = '${email}' AND mode = '${mode}'`;
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    if (result.length == 0) return res.json({ msg: "Invalid Email " });
    try {
      bcrypt.compare(password, result[0].password).then((matchPassword) => {
        if (matchPassword) {
          const token = jwt.sign({ _id: result[0].password }, JWT_SECRET);
          //   console.log(token);
          return res.json({
            token,
            user: {
              email: result[0].email,
              name: result[0].name,
              mode: result[0].mode,
              phone: result[0].phone,
              id: result[0].id,
            },
          });
        } else {
          return res.json({ msg: "Invalid Password" });
        }
      });
    } catch (error) {
      return res.json({ error: error });
    }
  });
});

module.exports = router;

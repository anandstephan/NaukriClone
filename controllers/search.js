const express = require("express");
const db = require("../model/connection");
const router = express.Router();

router.get("/title/:title", (req, res) => {
  let sql = `select * from jobs where title like'%${req.params.title}%'`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err.sqlMessage });
    } else {
      return res.status(200).json({ job: result });
    }
  });
});

router.get("/description/:description", (req, res) => {
  let sql = `select * from jobs where description like'%${req.params.description}%'`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err.sqlMessage });
    } else {
      return res.status(200).json({ job: result });
    }
  });
});

router.get("/name/:name", (req, res) => {
  let sql = `select * from jobs where recruiter_id=(select id from users where name='${req.params.name}');`;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err.sqlMessage });
    } else {
      return res.status(200).json({ job: result });
    }
  });
});

module.exports = router;

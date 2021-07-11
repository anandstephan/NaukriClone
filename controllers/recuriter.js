const express = require("express");
const router = express.Router();
const db = require("../model/connection");
const requireLogin = require("../middleware/requireLogin");

//Create a job
router.post("/createjob", requireLogin, (req, res) => {
  if (req.user.mode == "recruiter") {
    const { title, description, duration, companyname } = req.body;
    // console.log(req.body, req.user);
    // if(!title || !description || !duration || !name){
    //     return res.json({error:'Please Add All the Fields'})
    // }
    const newDate = ConvertData(duration);
    const job = {
      recruiter_id: req.user.id,
      title,
      description,
      duration: newDate,
      name: companyname,
    };
    let sql = "INSERT INTO `jobs` SET ?";

    db.query(sql, job, (err, result) => {
      if (err) {
        return res.json({ error: err.sqlMessage });
      } else {
        return res.json({ msg: "Job Created Succesfully" });
      }
    });
  } else {
    return res.json({ msg: "Please Login as a recruiter" });
  }
});

//View a job
router.post("/showjob", requireLogin, (req, res) => {
  if (req.user.mode == "recruiter") {
    let id = req.user.id;
    let sql = "SELECT * FROM `jobs` WHERE `recruiter_id` = " + id;
    db.query(sql, (err, result) => {
      if (err) {
        return res.json({ error: err.sqlMessage });
      } else {
        return res.json({ job: result });
      }
    });
  } else {
    return res.json({ msg: "Please login as a recruiter" });
  }
});

//Show Applied candidate Application
router.get("/showappliedcandidate", requireLogin, (req, res) => {
  if (req.user.mode == "recruiter") {
    let id = req.user.id;
    // let id = 13;
    let sql =
      "select jobs.name,jobs.title,jobs.description,jobs.duration from jobs INNER JOIN applied_jobs as app_jobs ON jobs.id=app_jobs.id where recruiter_id=" +
      id;
    // console.log(sql);
    db.query(sql, (err, result) => {
      if (err) {
        return res.json({ error: err.sqlMessage });
      } else {
        return res.json({ job: result });
      }
    });
  } else {
    return res.json({ msg: "Please login as a recruiter" });
  }
});

function ConvertData(duration) {
  var date = new Date(duration);
  let newdate = date.toISOString().slice(0, 19).replace("T", " ");
  return newdate;
}

module.exports = router;

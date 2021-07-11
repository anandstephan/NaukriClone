const express = require('express')
const router = express.Router()
const db = require('../model/connection')
const requireLogin = require('../middleware/requireLogin')

router.get('/appliedJob',requireLogin,(req,res) => {
    if(req.user.mode == "candidate"){
        let id = req.user.id
        let sql = "select jobs.name,jobs.title,jobs.description,jobs.duration from jobs INNER JOIN applied_jobs as app_jobs ON jobs.id=app_jobs.id where app_jobs.candidate_id="+id;
        db.query(sql,(err,result)=>{
            if(err) {
                return res.status(422).json({error:err.sqlMessage})
            }else{
                return res.status(200).json({job:result})
            }
        })
    }else{
        return res.status(200).json({msg:'Please login as a Jobseeker'})
    }
})

router.get('/applyingjob',requireLogin,(req,res) => {
    if(req.user.mode == "candidate"){
        let candidate_id = req.user.id
        const {job_id,status,applied_when} = req.body
        const newdate = ConvertData(applied_when)
        let sql = "insert into `applied_jobs` SET ?"
        let job = {job_id,candidate_id,applied_when:newdate,status}
        console.log(job)
        db.query(sql,job,(err,result)=>{
            if(err) {
                return res.status(422).json({error:err.sqlMessage})
            }else{
                return res.status(200).json({msg:"You Applied Succesfully"})
            }
        })
    }else{
        return res.status(200).json({msg:'Please login as a Jobseeker'})
    }
})


function ConvertData(date) {
    var date = new Date(date);
    let newdate = date.toISOString().slice(0, 19).replace('T', ' ');
    return newdate;
}


module.exports = router
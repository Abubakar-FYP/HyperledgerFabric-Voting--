const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requirelogin');

//Register Models
require('../Models/candidate');
require('../Models/criminal')

//Models

const Candidate = mongoose.model('Candidate');
const Criminal = mongoose.model('Criminal');

    

router.post('/createcandidate', async (req,res)=>{});
router.put('/updatecandidate', async (req,res)=>{});
router.post('/findcandidate', async (req,res)=>{});
router.delete('/deletecandidate', async (req,res)=>{});
router.get("/findallcandidate",async (req,res)=>{

    Candidate.find()
    .then((resp)=>{
        return res.status(200).json({message:resp});
    }).catch((err=>{
        return res.status(400).json({message:err});
    }));

});

router.get('/findcandidatebyballotid/:ballotId',async (req,res)=>{
    Candidate.find({ballotid:req.params.ballotId})
    .then((resp)=>{
        return res.status(200).json({message:resp});
    })
    .catch((err)=>{
        return res.status(400).json({message:err});
    });
});


module.exports = router;
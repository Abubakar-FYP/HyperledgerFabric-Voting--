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

    

router.post('/createcandidate', async (req,res)=>{

});

router.put('/updatecandidate', async (req,res)=>{

});

router.post('/findcandidate', async (req,res)=>{
   
   const {candidateId} = req.body;

   if(!candidateId){
       return res.status(400).json({message:"field is empty"});
   }

   Candidate.findOne({candidateId})
   .then(resp=>{
       res.status(200).json({message:resp});
   })
   .catch(err=>{
       res.status(400).json({message:err});
   });

})

router.delete('/deletecandidate', async (req,res)=>{

   const {candidateId} = req.body;

   if(!candidateId){
       return res.status(400).json({message:"field is empty"});
   }

   Candidate.findOneAndDelete({candidateId},(resp)=>{
    return res.status(200).json({message:"candidate has been successfully deleted"});
   }).catch(err=>{
    return res.status(400).json({message:err});
   });

});

router.get("/findallcandidate",async (req,res)=>{

    Candidate.find()
    .then((resp)=>{
        return res.status(200).json({message:resp});
    }).catch((err=>{
        return res.status(400).json({message:err});
    }));

});

router.get('/findcandidatebyballotid',async (req,res)=>{
    
    const {ballotId} = req.body;

    if(!ballotId){
        return res.status(400).json({message:"field is empty"});
    }

    Candidate.find({ballotId})
    .then((resp)=>{
        return res.status(200).json({message:resp});
    })
    .catch((err)=>{
        return res.status(400).json({message:err});
    });

});


module.exports = router;
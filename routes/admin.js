    //admin will create ballot
    const mongoose = require('mongoose');
    const epxress = require('express');
    const router = epxress.Router();
    const requireLogin = require('../middleware/requirelogin');
    const SHA256 = require('crypto-js/sha256');

    require('../models/ballot');

    const Ballot = mongoose.model('Ballot');
    const Party  = mongoose.model('Party');

    router.post('/createparty',async (req, res) => {

        const {partyId,partyName,img,candidateList} = req.body;

        if(!partyId||!partyName||!img){
            return res.status(408).json({message:"one or more fields empty"});
        }

        Party.findOne({partyid})
        .then((found=>{
          return res.status(408).json({message:`party ${found} with this id is already present`});
        }).catch(err=>{
          return console.log(err);
        }));

        //criminal,age,cnic(skip them if they dont meet conditions)

        const partyObj = new Party({
            partyId,
            partyName,
            img
        });

        partyObj.save()
        .then((resp)=>{
            res.status(408).json({message:"party successfully saved"});
        })
        .catch((err)=>{
            res.status(408).json({message:"there has been some error registering the new party"});
        })

    })

    router.get('/findparty',async (req, res) => {
    
        const {partyid} = req.body;

        if(!partyid){
            return res.status(408).json({message:"field empty"});
        }

        Party.findOne({partyid})
        .then((found=>{
            console.log(`found party is: ${found}`);
        }).catch(err=>{
            console.log(err)
        }));

    })

    router.put('/updateparty/:partyId',async (req, res) => {
    
    })

    router.post('/deleteparty',async (req, res) => {
    
    
    })

    router.post('/searchballot',async (req,res)=>{

    })
    
    module.exports = router
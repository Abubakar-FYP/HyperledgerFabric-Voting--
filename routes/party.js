const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requirelogin');

//Registering Models
require("../Models/party");

//Models
const Party = mongoose.model('Party');
    
    router.post('/createparty',async (req, res) => {

        const {partyId,name,img} = req.body;

        if(!partyId||!name||!img){
            return res.status(408).json({message:"one or more fields are empty"});
        }

        const found = await Party.findOne({partyId})
        .then((resp=>{
            if(resp){
                return res.status(400).json({message:`party with this id is already present`});
            }
        })).catch((err)=>{
            return res.status(208).json({message:err});
        });

        if(found){
            console.log(found);
            return res.status(401).json({message:`party with this id is already present`});
        }

        const newParty = new Party({
            partyId,
            name,
            img
        });

        newParty.save()
        .then((resp)=>{
            res.status(408).json({message:"party successfully saved"});
        })
        .catch((err)=>{
            res.status(408).json({message:err});
        });

    });

    router.get('/findparty',async (req, res) => {

        const {partyId} = req.body;

        if(!partyId){
            return res.status(400).json({message:"field empty"});
        }

        Party.findOne({partyId})
        .then((found=>{
            return res.status(200).json({message:found});
        }))
        .catch((err)=>{
            return res.status(400).json({message:err});
        });

    });

    router.put('/updateparty',async (req, res) => {
        
        const {partyId,name,img} = req.body;

        if(!partyId){
            return res.status(400).json({message:"field is empty"});
        }
        else{
        
           const found = await Party.find({partyId});
           
           if(!found){
            return res.status(400).json({message:"party does not exist with this id"});
           }

        }
        
        if(name){

            Party.findOneAndUpdate({partyId},{name},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party-name updated successfully"});
                }
            })
            .catch(err=>{
                res.status(403).json({error:err});
            });

        } 

        if(img){
            
            Party.findOneAndUpdate({partyId},{img},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party-image updated successfully"});
                }
            })
            .catch(err=>{
                res.status(403).json({error:err});
            });

        }

        if(name&&img){
            return res.status(200).json({message:"all fields updated"}); 
        }

        if(name&&!img){
            return res.status(200).json({message:"party-name updated successfully"}); 
        }

        if(!name&&img){
            return res.status(200).json({message:"party-image updated successfully"});
        }

        if(!name&&!img){
        return res.status(403).json({error:"no updation fields entered"});
        }

    });

    router.delete('/deleteparty',async (req, res) => { 

        const {partyId} = req.body;
       
        if(!partyId){
            return res.status(400).json({message:"field is empty"});
        }

        Party.findOneAndDelete({partyId},(resp)=>{
            return res.status(200).json({message:`party has been successfully deleted`}); 
        })
        .catch((err)=>{
            return res.status(403).json({error:err}); 
        });

    });

module.exports = router;
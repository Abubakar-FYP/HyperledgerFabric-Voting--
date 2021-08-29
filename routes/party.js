const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requirelogin');

require('../Models/party');

const Party = mongoose.model('../Models/party');
    
    router.post('/createparty',async (req, res) => {

        const {partyId,name,img} = req.body;

        if(!partyId||!name||!img){
            return res.status(408).json({message:"one or more fields empty"});
        }

        await Party.findOne({partyId})
        .then((found=>{
        return res.status(408).json({message:`party ${found} with this id is already present`});
        }).catch(err=>{
        return console.log(err);
        }));

        const partyObj = new Party({
            partyId,
            name,
            img
        });

        await partyObj.save()
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

        await Party.findOne({partyid})
        .then((found=>{
            console.log(`found party is: ${found}`);
        }).catch(err=>{
            console.log(err)
        }));

    })
    
    router.put('/updateparty/:partyId',async (req, res) => {
        const {partyId,name,img} = req.body;
        
        if(partyId){
            
            await  Party.findOneAndUpdate({partyId:req.params.partyId},{partyId},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party updated successfully"});
                }
            })
            .catch(err=>{
                res.status(403).json({error:"error in updating party-id"});
            });

        res.status(404).json({error:"one or more fields are empty"});
        } 
        
        if(name){
            
            await  Party.findOneAndUpdate({partyId:req.params.partyId},{partyId},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party-name updated successfully"})
                }
            })
            .catch(err=>{
                res.status(403).json({error:"error in updating party-name"});
            });
        } 

        if(img){
            
            await  Party.findOneAndUpdate({partyId:req.params.partyId},{partyId},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party-name updated successfully"})
                }
            })
            .catch(err=>{
                res.status(403).json({error:"error in updating party image"});
            });
        }

        if(!partyId&&!name&&!img){
        return res.status(403).json({error:"all of the fields is empty"});
        }
    
    })

    router.delete('/deleteparty/:partyId',async (req, res) => {
        
        const {partyId} = req.body;
       
        if(!partyId){
            return res.status(403).json({error:"party Id in the params is not present"});
        }

        await Party.findOneAndDelete({partyId},(resp)=>{
            if(resp){
                return res.status(200).json({message:`The party with ${ partyId } Id has been deleted`});
            }
        })
        .catch((err)=>{
            return res.status(403).json({error:"There was a problem finding the party or couldn't delete it"}); 
        });

    })

    //admin will create ballot
    const mongoose = require('mongoose');
    const epxress = require('express');
    const router = epxress.Router();
    const requireLogin = require('../middleware/requirelogin');
    const SHA256 = require('crypto-js/sha256');

    require('../models/ballot');

    const Party  = mongoose.model('Party');
    /* const Ballot = mongoose.model('Ballot');
    const Candidate = mongoose.model('Candidate');
    const Criminal = mongoose.model('Criminal');
 */

    router.post('/createparty',async (req, res) => {

        const {partyId,name,img} = req.body;

        if(!partyId||!name||!img){
            return res.status(408).json({message:"one or more fields empty"});
        }

        Party.findOne({partyId})
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
        const {partyId,name,img} = req.body;
        
        if(partyId){
            
            Party.findOneAndUpdate({partyId:req.params.partyId},{partyId},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party updated successfully"});
                }
            })
            .catch(err=>{
                res.status(403).json({error:"error in updating party-id"});
            });

           res.status(404).json({message:"party-id successfully updated"});
        } 
        
        if(name){
            
            Party.findOneAndUpdate({partyId:req.params.partyId},{partyId},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party-name updated successfully"})
                }
            })
            .catch(err=>{
                  res.status(403).json({error:"error in updating party-name"});
            });
        } 

        if(img){
            
            Party.findOneAndUpdate({partyId:req.params.partyId},{partyId},(resp)=>{
                if(resp){
                    res.status(200).json({message:"party-name updated successfully"})
                }
            })
            .catch(err=>{
                res.status(403).json({error:"error in updating party image"});
            });
        }

        if(!partyId||!name||!img){
          return res.status(403).json({error:"one of the fields is empty"});
        }
       
    })

    router.delete('/deleteparty/:partyId',async (req, res) => {
        if(!req.params.partyId){
            return res.status(403).json({error:"party Id in the params is not present"});
        }

        Party.findOneAndDelete({partyId:req.params.partyId},(resp)=>{
            if(resp){
                return res.status(200).json({message:`The party with ${req.params.partyId} Id has been deleted`});
            }
        })
        .catch((err)=>{
            return res.status(403).json({error:"There was a problem finding the party or couldn't delete it"}); 
        })

    })

    module.exports = router;
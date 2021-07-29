    //admin will create ballot
    const mongoose = require('mongoose')
    const epxress = require('express')
    const router = epxress.Router()
    const requireLogin = require('../middleware/requirelogin')
    const SHA256 = require('crypto-js/sha256')

    require('../models/ballot')
    /* require('../models/candidate') */

    const Ballot = mongoose.model('Ballot')
    /* const Candidate = mongoose.model('Candidate') */

    router.post('/createballot',requireLogin, (req, res) => {
        
        const { ballotid } = req.body
        
        if (!ballotid) {
          return res.status(422).json({ error: "please enter ballot id" })
        }

        Ballot.findOne({ ballotid: ballotid })
          .then(found => {
        
            if (found) {
              console.log(found)
              return res.status(422).json({ error: "User Already Exists" })
            }
             
            const ballothash =  SHA256(JSON.stringify(ballotid)).toString() //array to string!!!
            
              
                const newBallot = new Ballot({
                  ballotid,
                  ballothash
                })
                
                newBallot.save()
                .catch(err=>{
                    console.log(err)
                    return
                })

                res.status(200).json({message:"Correctly Entered"})
              })
              .catch(err => {
                console.log(err)
                return
              })
    })


    router.post('/searchballot',(req,res)=>{
        
        const {ballotid} = req.body

        if(!ballotid){
            console.log('no ballot id entered')
            return res.status(422).json({error:"please enter ballot id"})
        }

        Ballot.findOne({ballotid:ballotid})
        .then(found=>{
            if(found){
                console.log(found)
                res.status(200).json({message:"successfully found"})
            }else{
                res.status(422).json({message:"not found"})     
            }
        })
        .catch(err=>{
            console.log(err)
            return
        })


    })


    router.get('/getallballot',(req,res)=>{

        Ballot.find({})
        .then(found=>{
        console.log(found)  
        })
        .catch(err=>{
            console.log(err)
        })

    })
  

    
    module.exports = router
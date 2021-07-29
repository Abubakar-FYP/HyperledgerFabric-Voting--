    //includes signUp and LogIn
    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    const SHA256 = require('crypto-js/sha256')
    const jwt = require('jsonwebtoken')
    const {JWTKEY} = require('../url/keys')
    const requireLogin = require('../middleware/requirelogin')
    const otp = require('../middleware/otp')

    require('../models/admin')
    require('../models/voter')
    require('../models/hash')
    require('../models/candidate')
    


    const Admin = mongoose.model('Admin')
    const Voter = mongoose.model('Voter') 
    const Hash = mongoose.model('Hash')
    const Candidate = mongoose.model('Candidate')

    router.get('/protected',requireLogin,(req,res)=>{
      res.send('this route is now protected')
    }) 

    router.post('/signinadmin',requireLogin,(req,res)=>{
        
        const {email,password} = req.body

        if(!email || !password){
        return res.status(400).json({error:"fill all fields"})
        }

        Admin.findOne({email:email})
        .then((found=>{

                if(found){
                    const token = jwt.sign({_id:found._id},JWTKEY)
                    res.status(200).json({token})
                    return
                }

                else{
                    res.json({message:"wrong email or password"})       
                    return 
                }

        }))
        .catch(err=>{
            console.log(err)
            return
        })
    
    })

    router.post('/signupvoter',async (req,res,next)=>{
    
    const {cnic,phoneNumber} = await req.body
    const response = await otp.bird("",phoneNumber,otp.otpGenerator())
    
    if(!response){
        res.status(400).json({})
    }

    if(!name||!email||!cnic||!phoneNumber||!age||!address||!gender ||!nationality){
        return res.status(400).json({message:"one of the fields are empty"})
    }

    if(age<18){
        res.json({message:"age is below required age"})
        return 
    }
    
    //here we will send otp to confirm first and wait for a specific time for a reply if not then we return simply
    
    const hash = SHA256(JSON.stringify(cnic)).toString()

    Hash.findOne({hash:hash})
    .then(found=>{
        if(found){
        res.status(400).json({message:"cannot register user already exists"})
        return 
        }

            res.status(200)

            //insert otp middleware,to confirm user by his/her number     

                const voter = new Voter({
                    name,
                    email,
                    cnic,
                    phoneNumber,
                    age,
                    address,
                    gender,
                    nationality
                })
        
                voter.save()
                .then(voter=>{
                    console.log('voter registered')
                })
                .catch(()=>{
                    res.json("there seems to be an error in generating the voter")
                    return
                })

                const newhash = new Hash({
                    hash:hash
                })

                newhash.save()
                .then(newhash=>{
                    console.log('voter hash also created')
                    res.status(200).json('hash has been created first time,use this to login next time')
                })
                .catch(err=>{
                    console.log(err)
                })

        })
        .catch(err=>{
            console.log(err)
        })
            //using otp send the hash password to their mobiles
    })

    router.post('/signinvoter',requireLogin,(req,res,next)=>{

        const {cnic} = req.body
        console.log(typeof(cnic))

        if(!cnic){ 
            res.json({message:'not present'})
            return
        }
       
        res.status(200)

        const hash = SHA256(JSON.stringify(cnic)).toString()

        Hash.findOne({hash:hash}) //comparing the hased cnic
        .then(found=>{

            if(!found){
            console.log('Voter Not present')    
            res.status(400).json({message:'wrong cnic'})
            return
            }

            res.json('voter present')
        
            //middleware or route to main page
        })
        .catch(err=>{
            console.log(err)
        })

    })

module.exports = router
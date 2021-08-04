    //includes signUp and LogIn
    const express = require('express')
    const router = express.Router()
    const mongoose = require('mongoose')
    const SHA256 = require('crypto-js/sha256')
    const path = require('path')
    
    const jwt = require('jsonwebtoken')
    const {JWTKEY} = require('../Urls/keys')
    const requireLogin = require('../Middleware/requirelogin')
    const otp = require('../Middleware/otp')

    require('../Models/admin')
    require('../Models/voter')
    require('../Models/hash')
    
    const Admin = mongoose.model('Admin')
    const Voter = mongoose.model('Voter') 
    const Hash = mongoose.model('Hash')
    router.use(express.urlencoded({extended:false})) //take form data and access them in our post method 

    router.post('/check',(req,res)=>{
        res.send('check route')
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

    router.post('/signupvoter',async (req,res)=>{
    
    const {cnic,phoneNumber} = req.body

    const otp4digit = otp.otpGenerator()

    const response = await otp.bird("",phoneNumber,otp4digit) 
    W
    res.status(200).json({message:"request successfully made to OTP Manager"})

    if(!response){
        res.status(400).json({message:"No response was given by OTP Manager"})
    }

    if(otp4digit != await req.body.otpNumber){
        return res.status(400).json({message:"otp entered in the field does not match otp generated"})
    }

    //render or redirect next page
    //require post request(form data)

    /////////// Updated Code ^//////////

    if(!name||!email||!age||!address||!gender ||!nationality||!area||!street||!house){
        return res.status(400).json({message:"one of the fields are empty"})
    } //here we check all the input if their null

    if(age<18){
        res.json({message:"age is below required age"})
        return 
    }
    
    const hash = SHA256(JSON.stringify(cnic)).toString()

    Hash.findOne({hash:hash})
    .then(found=>{
        if(found){
        res.status(400).json({message:"cannot register user already exists"})
        return 
        }

                const voter = new Voter({
                    name,
                    email,
                    cnic,
                    phoneNumber,
                    age,
                    gender,
                    nationality,
                    voteflag,
                    ballotid,
                    address
                })
        
                voter.save()
                .then(voter=>{
                    res.status(200).json({message:'successfull voter'})
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
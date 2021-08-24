    //packages imported
    const express = require('express');
    const router = express.Router();
    const mongoose = require('mongoose');
    const SHA256 = require('crypto-js/sha256');
    const expsession = require('express-session')

    //middleware
    const jwt = require('jsonwebtoken');
    const {JWTKEY} = require('../Urls/keys');
    const requireLogin = require('../Middleware/requirelogin');
    const otp = require('../Middleware/otp');
    const request = require('../Middleware/requestHandler');

    //registering models
    require('../Models/admin');
    require('../Models/voter');
    require('../Models/hash');
    
    //models
    const Admin = mongoose.model('Admin');
    const Voter = mongoose.model('Voter'); 
    const Hash = mongoose.model('Hash');
    router.use(express.urlencoded({extended:false})) //take form data and access them in our post method 


    router.post('/',(req,res)=>{
        res.send('signup home');
    }) 

    router.post('/check',(req,res)=>{
        res.send('signup home route');
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

    router.post('/Signup',async (req,res,next)=>{
    
    const{name,cnic,email,age,phoneNumber,gender,nationality,area,street,house} = req.body;
    
    if(!cnic||!phoneNumber){
        return res.status(422).json({message:"one or more of the fields are empty"});
    }
    
    await Voter
    .findOne({cnic:cnic})
    .then(found=>{
        if(found){
            return res.status(400).json({message:"voter already registered"});
        }
    })
    .catch(err=>{
        if(err){
            res.status(400).json({message:err});
        }
    })

    const genOtp = otp.otpSender(phoneNumber); //middleware,for sending otp, and saves the otp in variable
    
    if(typeof(genOtp)=="string"){
        res.json({message:genOtp.toString()});
    }

    localStorage.setItem('myOtp',genOtp); //saves otp for use in next route
    
    res.status(200).json({message:"successufully otp sent"});

    next();
    }) //save otp in cookie or session to use in another route or middleware

    router.post('/signupotp',async (req,res,next)=>{
    
    const genOtp = localStorage.getItem('myOtp'); //we get our otp from previous route

    if(req.body.otp != genOtp){
        return res.status(404).json({message:"the otp does not match"});
    }

    })

    router.post('/signupinfo',async (req,res)=>{

    const{name,cnic,email,age,phoneNumber,gender,nationality,area,street,house} = req.body;
    
    const newVoter = new Voter({
        name,
        cnic,
        email,
        age,
        phoneNumber,
        gender,
        nationality,
        area,
        street,
        house
    });

    newVoter.save()
    .then((resp)=>{
        if(!resp){
            res.json({message:"there was some error saving the voter"});
            return ;
        }

        res.json({message:"Voter successfully saved"});

    }).catch(err=>{
            res.json({message:`there was some error saving the voter ${err}`});
    });

    })

    router.post('/signin',async (req,res,next)=>{

        const {cnic,phoneNumber} = req.body;
        
        if(!cnic||!phoneNumber){ 
            res.json({message:'not present'});
            return ;
        }

        Voter.findOne({cnic:cnic}).then(found=>{
            if(!found){
                return res.status(400).json({message:"voter not registered"});
            }
        })

        const genOtp = otp.otpSender(phoneNumber);

        localStorage.setItem('sOtp',genOtp);
    })

    router.post('/signinotp',async (req,res)=>{
 
        const genOtp = localStorage.getItem('sOtp');

        if(genOtp != await req.body.otpNumber){
            return await res.status(400).json({message:"otp entered in the field does not match otp generated"});
        }
        
        res.status(200).json({message:"successfully login"});
    })

module.exports = router;
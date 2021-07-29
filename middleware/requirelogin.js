const jwt = require('jsonwebtoken')
const {JWTKEY}  = require('../url/keys')

const mongoose = require('mongoose')//remember this format!!!
require('../models/admin')
const Admin = mongoose.model('Admin')


    module.exports = (req,res,next)=>{

        const {authorization} = req.headers

    //authorization === Bearer (0-2fopmwev103rkoef)

    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }

    const token = authorization.replace("Bearer ","")

    jwt.verify(token,JWTKEY,(err,payload)=>{
        if(err){
           return res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload

        Admin.findById({_id})
        .then(found=>{
            req.voter = found
        })
        next()
    })
}
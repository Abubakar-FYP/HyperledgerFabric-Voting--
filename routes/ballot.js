const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requirelogin');

//Register Models
require('../Models/ballot');

//Models
const Ballot = mongoose.model('Ballot');

    

router.post('/createballot',async (req,res)=>{
    
});
router.get('/findballot',async (req,res)=>{});
router.put('/updateballot',async (req,res)=>{});
router.delete('/deleteballot',async (req,res)=>{});

module.exports = router;
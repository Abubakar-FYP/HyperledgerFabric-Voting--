const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requirelogin');

//Register Models
require('../Models/ballot');

//Models
const Ballot = mongoose.model('Ballot');

    

router.post('/createBallot',async (req,res)=>{
    
});
router.get('/findBallot',async (req,res)=>{});
router.put('/updateBallot',async (req,res)=>{});
router.delete('/deleteBallot',async (req,res)=>{});

module.exports = router;
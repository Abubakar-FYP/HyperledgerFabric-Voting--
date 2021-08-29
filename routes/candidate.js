const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requirelogin');

//Register Models
require('../Models/candidate');
require('../Models/criminal')

//Models

const Candidate = mongoose.model('Candidate');
const Criminal = mongoose.model('Criminal');

    

router.post('/createCandidate', async (req,res)=>{});
router.put('/updateCandidate', async (req,res)=>{});
router.post('/findCandidate', async (req,res)=>{});
router.delete('/deleteCandidate', async (req,res)=>{});


module.exports = router;
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requirelogin');

//Registering Models
require('../Models/area');

//Models
const Area = mongoose.model('Area');
    

router.post('/createArea',async (req,res)=>{});
router.get('/findArea',async (req,res)=>{});
router.put('/updateArea',async (req,res)=>{});
router.delete('/deleteArea',async (req,res)=>{});


module.exports = router;
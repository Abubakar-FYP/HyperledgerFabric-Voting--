const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const requireLogin = require("../middleware/requirelogin");

require("../Models/candidate");

const Candidate = mongoose.model("Candidate");

router.post("/createcandidate", async (req, res) => {
    const 
});

router.delete("/deletecandidate", async (req, res) => {});

router.get("/findcandidate", async (req, res) => {});

router.get("/findallcandidate", async (req, res) => {});


module.exports = router;

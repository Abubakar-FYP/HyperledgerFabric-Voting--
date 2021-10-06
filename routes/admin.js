const mongoose = require("mongoose");
const epxress = require("express");
const router = epxress.Router();
const requireLogin = require("../middleware/requirelogin");

require("../Models/party");

const Party = mongoose.model("Party");


//gets all the parties that are unapproved
router.get("/findallunapprovedparties", async (req, res) => {
  Party.find({ is_valid: false })
    .then((resp) => {
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      console.log(err);
    });
});

//approves the party
router.put("/approveparty/:partyId", async (req, res) => {
  Party.findOneAndUpdate(
    { partyId: req.params.partyId },
    { is_valid: true },
    (resp) => {
      res
        .status(200)
        .json({ message: `${req.params.partyId} has been approved` });
    }
  ).catch((err) => {
    console.log(err);
  });
});

module.exports = router;

const mongoose = require("mongoose");
const epxress = require("express");
const router = epxress.Router();
const requireLogin = require("../middleware/requirelogin");

require("../Models/party");

const Party = mongoose.model("Party");

//gets all the parties that are unapproved
//populate when ready
router.get("/findallunapprovedparties", async (req, res) => {
  Party.find({ is_valid: false })
    .then((resp) => {
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      console.log(err);
    });
});

//dont need to populate because ot required
//gets all the parties that are approved
router.get("/findallapprovedparties", async (req, res) => {
  await Party.find({ is_valid: true })
    .then((resp) => {
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      console.log(err);
    });
});

//populate when ready
router.get("/getallparties", async (req, res) => {
  await Party.find({})
    .populate({
      path: "candidate",
    })
    .exec((err, docs) => {
      if (!err) {
        res.status(200).json({ message: docs });
      } else {
        console.log(err);
        res.status(200).json({ message: err });
      }
    });
});

//approves the party
router.put("/approveparty/:partyId", async (req, res) => {
  Party.findOneAndUpdate(
    { partyId: req.params.partyId },
    { is_valid: true },
    (resp) => {
      res.status(200).json({ message: `party has been approved` });
    }
  ).catch((err) => {
    console.log(err);
  });
});

module.exports = router;

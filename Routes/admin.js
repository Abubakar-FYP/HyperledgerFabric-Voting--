const mongoose = require("mongoose");
const epxress = require("express");
const router = epxress.Router();
const requireLogin = require("../Middleware/requirelogin");

require("../Models/party");

const Party = mongoose.model("Party");

//gets all the parties that are unapproved
//populate when ready
router.get("/getpendingparties", async (req, res) => {
  Party.find({ is_valid: false })
    .populate("candidate")
    .then((resp) => {
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      console.log(err);
    });
});

//dont need to populate because ot required
//gets all the parties that are approved
router.get("/getapprovedparties", async (req, res) => {
  await Party.find({ is_valid: true })
    .select("partyName _id")
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
//takes a party _id
//updates the is_valid field,meaning approves the party
router.put("/approveparty/:partyId", async (req, res) => {
  await Party.findOneAndUpdate(
    { _id: req.params.partyId },
    { is_valid: true },
    (resp) => {
      res.status(200).json({ message: `party has been approved` });
    }
  ).catch((err) => {
    console.log(err);
  });
});
//rejects a party
router.delete("/rejectparty/:partyId", async (req, res) => {
  let resp = await Party.findOne({ _id: req.params.partyId });

  if (resp == null) {
    return res.status(400).json({ message: `party does not exist` });
  }

  resp = await Party.findOneAndDelete({ _id: req.params.partyId });

  if (resp === null) {
    return res.status(400).json({ message: `party does not exist` });
  } else {
    return res.status(200).json({ message: `party has been deleted` });
  }
});

module.exports = router;

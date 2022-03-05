const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const Election = require("./election").schema;
const Voter = require("./voter").schema;
const Ballot = require("./ballot").schema;
const Campaign = require("./campaign").schema;
const Party = require("./party").schema;
const Candidate = require("./candidate").schema;
const Nadra = require("./nadra").schema;

const electionLedger = new mongoose.Schema({
  election: Election,
  voter: [Voter],
  ballot: [Ballot],
  campaign: [Campaign],
  party: [Party],
  candidate: [Candidate],
  nadra: [Nadra],
});

const ElectionLedger =
  global.ElectionLedger || mongoose.model("ElectionLedger", electionLedger);
//for election

module.exports = ElectionLedger;

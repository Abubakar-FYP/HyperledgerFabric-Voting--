const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    startTime: {
        type: String,
    },
    endTime: {
        type: Number
    },
    electionName: {
        type: String,
    },
    electionType: {
        type: String,
    },
    candidates: {
        type: [String]
    },
    parties: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
        }
    ]

})

const Election = mongoose.model("Election", electionSchema)

module.exports = Election
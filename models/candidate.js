const mongoose = require('mongoose');

const candidate = new mongoose.Schema({

    name:{
		type:String,
		required:true
	},
	
	email:{
		type:String,
		required:true
	},
	
	cnic:{ 
		  type:Number,
		  required:true
	},
	
	phoneNumber:{
		  type:Number,
		  required:true
	},
	
	age:{
		  type:Number,
		  required:true
	},
	
	area:{
		type:String,
		required:true
	},
	 
	street:{
		type:String,
		required:true
	},

	house:{
		type:String,
		required:true
	},

	gender:{
		  type:String,
		  required:true
	},
	
	nationality:{
		  type:String,
		  required:true
	},
		  
	religion:{
		type:String,
		required:true,
	},

	ballotid:{
		  type: mongoose.Schema.Types.ObjectId,
		  ref:'Ballot'
	},

	partyId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Party'
	},

	invalid:{
		type:Boolean,
		default:0
	}

});

global.Candidate = global.Candidate || mongoose.model("Candidate",candidate); 
module.exports = global.Candidate;
const mongoose = require('mongoose') //mongoose imported

const voterSchema = new mongoose.Schema({

	name:{
      type:String,
      required:true
	},

	email:{
      type:String,
      required:true
	},
	
	cnic:{ //will recognize ballot from this
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
	
	gender:{
		type:String,
		required:true
	},
	
	nationality:{
		type:String,
		required:true
	},

	voteflag:{
		type:Boolean,
		default:false
	}, //to check whether he has voted or not,Initially zero

	ballotid:{
		type:Number,
		default:0000
	}, //this will be randomly assigned upon when

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

})  //all the data's hash will be created to login next time*

global.Voter = global.Voter || mongoose.model("Voter",voterSchema) 
module.exports = global.Voter

//Voter model registered,
//we also can export this model,but mongoose object stores it
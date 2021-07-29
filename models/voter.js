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
		default:false,
		required:true
	}, //to check whether he has voted or not,Initially zero

	ballotid:{
		type:Number,
		required:true,
		default:0000
	}, //this will be randomly assigned upon when

	address:{
		type:String,
		required:true
	 }, //address is divided into area,street,house
	
})  //all the data's hash will be created to login next time

mongoose.model("Voter",voterSchema); //Voter model registered,
//we also can export this model,but mongoose object stores it 
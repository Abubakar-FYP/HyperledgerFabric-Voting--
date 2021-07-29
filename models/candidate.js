const mongoose = require('mongoose') //Admin editable only

const candidateSchema = new mongoose.Schema({
	
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
	
	  address:{
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
	
	  party:{
		type:String,
		required:true
	  },
	  
	  religion:{
		type:String,
		required:true,
	  },

	  ballotid:{
		  type:Number,
		  required:true
	  },
	  
	  approvalflag:{
		  type:Boolean,
		  required:true,
		  default:false,
	  },

	  voteflag:{
		type:Boolean,
		default:false,
		required:true
	  },
	  
})

mongoose.model("Candidate",candidateSchema);
var messagebird = require('messagebird')('IzsjzHBmGCH4WG3RcFQxMybtk');

const bird = (from,to,message,next,req)=>{
  
  var i = 0
  for(;i<to.length ;i++){}
  if(i!=11){
    return "Entered Phone Number is not a 11 digit number";
  }

  const code = "+92";

  to = to.slice(1);
  const number = code+to;

  var params = {
    'originator':"PVS",
    'recipients': [number],
    'body': ` ${message} is your otp assigned by PVS,This is sent to you for verification `
  };

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });
}

const otpGenerator = ()=>{
  const otp = Math.floor(Math.random() * 10000)
  return otp
}

const otpSender = (to,next)=>{
  
  const otp4digit = otpGenerator()
    
  const response = bird("",to,otp4digit) 

  if(!response){
    console.log('No response was given by otp Manager');
    return "Entered Number is Wrong";
  }

  console.log(response)
  
  return otp4digit
}


module.exports = {
  "bird":bird,
  "otpGenerator":otpGenerator,
  "otpSender":otpSender
}
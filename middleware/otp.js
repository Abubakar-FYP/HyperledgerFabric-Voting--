var messagebird = require('messagebird')('IzsjzHBmGCH4WG3RcFQxMybtk');

const bird = (from,to,message,next,req)=>{

  var params = {
    'originator':"PVS",
    'recipients': [to],
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
    console.log('No response was given by otp Manager')
    return 
  }

  console.log(response)
  
  return otp4digit
}


module.exports = {
  "bird":bird,
  "otpGenerator":otpGenerator,
  "otpSender":otpSender
}
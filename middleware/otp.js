var messagebird = require('messagebird')('svVfL54wCBI7CE26F8QfFBDFt');

const bird = async (from,to,message)=>{
    
    var params = {
      'originator':from,
      'recipients':to,
      'body':message
    };

    messagebird.messages.create(params,await function (err, response) {
      try{
        console.log(response);
      }
      catch(err){
        return console.log(err);
      }
    });
}

const otpGenerator = async ()=>{
  const otp = await Math.floor(Math.random() * 10000)
  return otp
}
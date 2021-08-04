var messagebird = require('messagebird')('svVfL54wCBI7CE26F8QfFBDFt');

const bird =(from,to,message)=>{

    console.log(typeof(to))
    
    var params = {
      'originator': "Ali",
      'recipients': [to],
      'body': message
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

module.exports = {
  "bird":bird,
  "otpGenerator":otpGenerator
}
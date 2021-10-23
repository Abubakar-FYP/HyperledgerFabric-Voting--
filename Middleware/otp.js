const messagebird = require("messagebird")("ghnhj9IMDIisXOffqvsreoR48");
var checkStatus = 1;
var checkLength = 0;

const bird = (from, to, message) => {
  console.log(to.length);

  if (to.length != 11) {
    return "Entered Phone Number is not a 11 digit number";
  }

  checkLength = 1;

  const code = "+92";

  to = to.slice(1);
  const number = code + to;

  var params = {
    originator: "PVS",
    recipients: [number],
    body: ` ${message} is your otp assigned by PVS,This is sent to you for verification `,
  };

  messagebird.messages.create(params, function (err, response) {
    if (err) {
      checkStatus = 0;
      return console.log(err);
    }
    return console.log(response);
  });
};

const otpGenerator = () => {
  const otp = Math.floor(Math.random() * 10000);
  return otp;
};

const otpSender = (to) => {
  const otp4digit = otpGenerator();

  const response = bird("", to, otp4digit);

  if (checkLength == 0) {
    return response;
  }

  if (checkStatus == 0) {
    console.log(checkStatus);
    return "Entered Number is Wrong or a server issue";
  }

  return otp4digit;
};

module.exports = {
  bird: bird,
  otpGenerator: otpGenerator,
  otpSender: otpSender,
};

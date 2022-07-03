const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

//mailgun.com
//https://www.youtube.com/watch?v=3bxjvequldY

const auth = {
  auth: {
    api_key: "",
    domain: "",
  },
};

const transporter = nodemailer.createTransport(mailGun(auth));

function sendMail(email, subject, text) {
  const mailOptions = {
    from: email,
    to: "youremail.@gmail.com",
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("ERROR: message not sent");
      //could not send message
    } else {
      console.log("Message sent!");
      //could send message
    }
  });
}

module.exports = sendMail;

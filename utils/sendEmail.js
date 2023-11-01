import nodemailer from 'nodemailer'


const sendEmail = async function( email, subject, message){
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      //`user` and `pass` values from <https://forwardemail.net>
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });



await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  });

}

export default sendEmail;
// async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object


  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //


// main().catch(console.error);
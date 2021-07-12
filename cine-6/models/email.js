const smtp = require('nodemailer');
const asyncHandler =  require('express-async-handler');

  exports.sendContact = asyncHandler( async function (to,subject, content) {
    let transporter = smtp.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {


        //
        user: 'tempsampleindex123@gmail.com',
        pass: 'tichapqicjj'

   
      },
      //Turn on when (git push heroku master)
      // tls:{
      //     rejectUnauthorized: false
      // }
    });
  
    const mailOptions = {
        from: '"Nodemailer Contact" <tempsampleindex123@gmail.com>',
        to,
        subject,
        text: 'Temp Sample Index',
        html: content,
    }
    
    transporter.sendMail(mailOptions);

    //https://www.youtube.com/watch?v=tPyrzqOtcLk

  });








  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2018cs071@stu.ucsc.cmb.ac.lk",
      pass: "Chamika@97",
    },
  });

  var mailOptions = {
    from: "2018cs071@stu.ucsc.cmb.ac.lk",
    to: "2018cs071@stu.ucsc.cmb.ac.lk,",
    subject: "Sending Email using Node.js",
    text: `Hi Supun, thank you for your nice Node.js tutorials.
          I will donate 50$ for this course. Please send me payment options.`,
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
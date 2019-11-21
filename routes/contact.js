var express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      middleware = require('../middleware'),
      User = require('../models/user'),
      nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/:id', function (req, res) {
  var mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'thirdeyeglassworks710@gmail.com',
      pass: process.env.GMAILPW
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: 'thirdeyeglassworks710@gmail.com',
    subject: 'New message from your website',
    text:`${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      req.flash("error", error.responseCode + ", message didn't send. Please try again!");
      res.redirect('/contact');    }
    else {
      req.flash("success", "Message sent. Ill get back to you as soon as possible.")
      res.redirect('back');
    }
  });
});

module.exports = router;

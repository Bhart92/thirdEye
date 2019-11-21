var express = require("express"),
    router = express.Router(),
    User = require('../models/user'),
    async = require("async"),
    passport = require("passport"),
    crypto = require("crypto"),
    nodemailer = require("nodemailer"),
    multer = require('multer'),
    middleware = require('../middleware/index');

var GalleryItem = require('../models/galleryItem.js'),
      User = require('../models/user');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif|tif)$/i)) {
        return cb(new Error(''), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter}),
    cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'thirdeyeglassworks',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

//create new user route
router.get("/register", middleware.isLoggedIn, function(req, res){
  res.render("register");
});
router.post('/', middleware.isLoggedIn, function(req, res){
  var newUser = new User({
    username: req.body.username,
    image: req.body.image,
    email: req.body.email,
    about: req.body.about
  });
  if(req.body.adminCode === 'active'){
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.redirect('/');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/');
    })
  });
});
//login routes
router.post('/login', passport.authenticate('local',
{
  successRedirect: 'admin', failureRedirect: 'back'
}), function(res, res){
});
router.get('/admin', middleware.isLoggedIn, function(req, res){
  GalleryItem.find({}, function(err, galleryItems){
    User.findById('5d6df6c49b420d00170bdca6', function(err, user){
      if(err){
        console.log(err);
      } else{
        res.render('admin', {galleryItems: galleryItems, user: user});
      }
    });
  });
});
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/');
});
//password change routes
router.post("/forgot", middleware.isLoggedIn, function(req, res, next){
  async.waterfall([
    function(done){
      crypto.randomBytes(20, function(err, buf){
        if(err){
          req.flash("Something went wrong, please try again");
          res.redirect("back");
        }
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done){
      User.findOne({email: req.body.email }, function(err, user){
        if(err){
          req.flash("Something went wrong, plase try again");
          res.redirect("back");
        }
        if(!user){
          console.log("No account with that email address found");
          return res.redirect("/error");
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // pass change token expires after 1 hour
        user.save(function(err){
          done(err, token, user);
        });
      });
    },
    function(token, user, done){
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'thirdeyeglassworks710@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'thirdeyeglassworks710@gmail.com',
        text: 'Click the link below to change your password. http://' + req.headers.host + '/reset/' + token + '\n\n'
      };
      smtpTransport.sendMail(mailOptions, function(err){
        if(err){
          req.flash("Something went wrong, plase try again");
          res.redirect("back");
        }
        console.log('mail sent');
        req.flash("success", 'reset email sent.');
        done(err, 'done');
      });
    }
  ], function(err){
    if(err) return next(err);
    res.redirect('/');
  });
});
router.get('/reset/:token', middleware.isLoggedIn, function(req, res){
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
    if(err){
      req.flash("error", "yuh dun fucked up, try gain.");
      res.redirect("/");
    }
    if(!user){
      return res.redirect('/error');
    }
    res.render('reset', {token: req.params.token});
  });
});
router.post("/reset/:token ", middleware.isLoggedIn, function(req, res){
  async.waterfall([
    function(done){
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
        if(err){
          alert("Looks like something went wrong, try again.");
          res.redirect("back");
        }
        if(!user){
          return res.redirect('/error');
        }
        if(req.body.password === req.body.confirm){
          user.setPassword(req.body.password, function(err){
            if(err){
              req.flash("error", "Looks like something went wrong, try again.");
              return res.redirect('back');
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err){
              if(err){
                alert("Looks like something went wrong, try again.");
                return res.redirect('/error');
              }
              req.logIn(user, function(err){
                done(err, user);
              });
            });
          });
        } else{
          return res.redirect("back");

        }
      });
    },
    function(user, done){
       var smtpTransport = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
           user: 'thirdeyeglassworks710@gmail.com',
           pass: process.env.GMAILPW
         }
       });
       var mailOptions = {
         to: user.email,
         from: 'thirdeyeglassworks710@gmail.com',
         subject: 'Your password has been changed',
         text: 'Hello, \n\n' +
                'This is a confirmation that the password for your account ' + user.email + 'has just been changed'
       };
       smtpTransport.sendMail(mailOptions, function(err){
         if(err){
           req.flash("error", "Looks like something went wrong, try again.");
           res.redirect("back");
         }
         res.render("/", { messages: req.flash("success", "A reset link was sent to your email.") });
         done(err);
       });
    }
  ],function(err){
    if(err){
      req.flash("error", "Looks like something went wrong, try again.");
      res.redirect("back");
    }
    res.render("/", { messages: req.flash("success", "A reset link was sent to your email.") });
  });
});


module.exports = router;

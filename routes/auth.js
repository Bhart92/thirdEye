var express = require("express"),
    router = express.Router(),
    User = require('../models/user'),
    passport = require("passport"),
    multer = require('multer');
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


router.get("/register", function(req, res){
  res.render("register");
})
//create new user route
router.post('/', function(req, res){
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
  successRedirect: 'back', failureRedirect: '/about'
}), function(res, res){
  console.log('logged');
  req.flash('success', 'Logged in');
});
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'logged out');
  res.redirect('/');
})





module.exports = router;

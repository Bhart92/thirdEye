var express = require("express"),
    router = express.Router(),
    GalleryItem = require('../models/galleryItem'),
    User = require('../models/user'),
    passport = require("passport"),
    multer = require('multer'),
    middleware = require('../middleware/index');
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

router.put('/:id', middleware.isLoggedIn, upload.single("image"), function(req, res){
  User.findById('5d6df6c49b420d00170bdca6', async function(err, user){
    if(err){
      console.log(err);
    } else{
      if(req.file){
        try{
          await cloudinary.v2.uploader.destroy(user.imageId);
          let result = await cloudinary.v2.uploader.upload(req.file.path);
          user.imageId = result.public_id;
          user.image = result.secure_url;
        } catch(err){
          console.log(err);
          res.redirect('/admin');
        }
      }
      user.about = req.body.about;
      user.save();
      req.flash('success', 'About me updated')
      res.redirect('/admin');
    }
  });
});

module.exports = router;

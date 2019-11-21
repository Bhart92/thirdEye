var express = require("express"),
    router = express.Router(),
    GalleryItem = require('../models/galleryItem'),
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


//create gallery item route
router.post('/:id', middleware.isLoggedIn,  upload.single('image'), function(req, res){
  if(!req.file){
    req.flash('error', 'You need to upload a file');
    res.redirect('/admin');
  } else{
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err){
        console.log(err);
        res.redirect('/admin');
      }
      // add cloudinary url for the image to the Post object under image property
      req.body.image = result.secure_url;
      // add image's public_id to Post object
      req.body.imageId = result.public_id;
      GalleryItem.create(req.body, function(err, galleryItem){
        if(err){
          console.log(err);
          return res.redirect('back');
        }
        req.flash('success', 'Successfully Added');
        res.redirect('/admin');
      });
    });
  }
});

//delete route
router.delete('/:id', middleware.isLoggedIn, middleware.itemExists, function(req, res){
  GalleryItem.findById(req.params.id, function(err, galleryItem){
    if(err){
      console.log(err);
      return res.redirect('back');
    } else{
      galleryItem.remove();
      req.flash('success', 'Item deleted');
      res.redirect('/admin');
    }
  });
});

module.exports = router;

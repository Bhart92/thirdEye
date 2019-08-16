var express = require("express"),
    router = express.Router(),
    GalleryItem = require('../models/galleryItem'),
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



module.exports = router;

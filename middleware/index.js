const GalleryItem = require('../models/galleryItem.js'),
      User = require('../models/user');

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "you need to be logged in.")
  res.redirect("back");
}
middlewareObj.itemExists = function(req, res, next){
  if(req.isAuthenticated()){
    GalleryItem.findById(req.params.id, function(err, item){
      if(err || !item){
        req.flash("error", "Item doesn't exist.")
        res.redirect("back");
      } else{
        next();
      }
    });
  }
}




module.exports = middlewareObj;

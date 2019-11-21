const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  image: String,
  imageId: {type: String, default: '123'}
});

let GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);

module.exports = mongoose.model('GalleryItem', galleryItemSchema);

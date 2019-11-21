const express = require('express'),
       app = express(),
       bodyParser = require('body-parser'),
       mongoose = require('mongoose'),
       flash = require('connect-flash'),
       passport = require('passport'),
       localStrategy = require('passport-local'),
       methodOverride = require("method-override"),
       authRoutes = require("./routes/auth"),
       aboutRoutes = require("./routes/about"),
       galleryRoutes = require("./routes/gallery"),
       contactRoutes = require("./routes/contact"),
       port = process.env.PORT || 3000;
       require("dotenv").config();

const GalleryItem = require('./models/galleryItem.js'),
      User = require('./models/user');
const multer = require('multer')

      const storage = multer.diskStorage({
        filename: function(req, file, callback) {
          callback(null, Date.now() + file.originalname);
        }
      });
      const imageFilter = function (req, file, cb) {
          // accept image files only
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif|tif)$/i)) {
              return cb(new Error(''), false);
          }
          cb(null, true);
      };
      const upload = multer({ storage: storage, fileFilter: imageFilter}),
          cloudinary = require('cloudinary');
      cloudinary.config({
        cloud_name: 'thirdeyeglassworks710',
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
      });

// mongoose.connect("mongodb://localhost:27017/thirdEye", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://adminMan221199:Bella2121@thirdeyeglassart-tbwph.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(flash());

app.use(require('express-session')({
  secret: 'LoyGlass',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use("/", authRoutes);
app.use("/", galleryRoutes);
app.use("/", aboutRoutes);
app.use("/contact", contactRoutes);

app.get('/', function(req, res){
  GalleryItem.find({}, function(err, galleryItems){
    User.findById('5d6df6c49b420d00170bdca6', function(err, user){
      if(err){
        console.log(err);
      } else{
        res.render('landing', {galleryItems: galleryItems, user: user});
      }
    });
  });
});

app.listen(port, () => console.log('live'));

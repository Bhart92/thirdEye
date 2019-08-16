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
       port = process.env.PORT || 3000;
       require("dotenv").config();

const GalleryItem = require('./models/galleryItem.js'),
      User = require('./models/user');
      var multer = require('multer')


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


mongoose.connect("mongodb://localhost:27017/thirdEye", {useNewUrlParser: true});

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


app.get('/', function(req, res){
  GalleryItem.find({}, function(err, galleryItems){
    User.findById('5d563b156c036e290c844cfd', function(err, user){
      if(err){
        console.log(err);
      } else{
        res.render('landing', {galleryItems: galleryItems, user: user});
      }
    });
  });
});

app.put('/:id', upload.single("image"), function(req, res){
  User.findById('5d563b156c036e290c844cfd', async function(err, user){
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
          return res.redirect('about');
        }
      }
      user.about = req.body.about;
      user.save();
      req.flash('success', 'About me updated')
      res.redirect('/');
    }
  });
});


app.listen(port, () => console.log('live'));

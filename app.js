const express        = require('express'),
      path           = require('path'),
      exphbs         = require('express-handlebars'),
      methodOverride = require('method-override'),
      flash          = require('connect-flash'),
      session        = require('express-session'),
      bodyParser     = require('body-parser'),
      passport       = require('passport'),
      mongoose       = require('mongoose');

const app = express();

// Load ROUTES
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);
// DB config
const db = require('./config/database');

// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



/******** Middleware ***********/

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultlayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override middleware
app.use(methodOverride('_method'));

// Express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg   = req.flash('error_msg');
  res.locals.error       = req.flash('error');
  res.locals.user        = req.user || null;
  next();
});

/******** ROUTES *********/

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT ||  5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});

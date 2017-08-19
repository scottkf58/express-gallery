// Node packages
const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const RedisStore = require('connect-redis')(session);
const LocalStrategy = require('passport-local').Strategy;

// Dev generated packages
const loginRouter = require('./routes/login.js');
const createRouter = require('./routes/create.js');
const galleryRouter = require('./routes/gallery.js');
const CONFIG = require('./config/config.json');

// Database
const { Photo, User } = require('./models');
// const { photoMetas } = require('./public/js/metaFields.js');
const db = require('./models');

const PORT = process.env.PORT || 3000;


const app = express();
app.use(bp.urlencoded());

app.use(session ({
  store: new RedisStore(),
  secret: CONFIG.SESSION_SECRET,
  name: 'express_gallery_sessions',
  cookie: {
    maxAge: 1000000,
  },
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  // Client side username, password
  function (username, password, done) {
    console.log('client-side-username', username);
    console.log('client-side-password', password);

    // Sequelize queries, using database to authenticate
    User.findOne({
      where: {
        username: username
      }
    }).then( (user) => {
      if (user !== null) {
        bcrypt.compare(password, user.password)
          .then( (result) => {
            if (result) {
              console.log('Username and password correct!');
              return done(null, user);
            } else {
              console.log('password does not match');
              return done(null, false, { message: 'Incorrect Password' });
            }
          }).catch( (err) => {
            console.log(err);
        });
      } else {
        throw 'User not found';
      }
    }).catch( (err) => {
      console.log(err);
      return done(null, false, { message: 'Incorrect Username' });
    });
  }
));

passport.serializeUser(function (user, done) {
  console.log('serializing the user into session');
  done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser(function (userId, done) {
  console.log('adding user information into the req object');
  User.findOne({
    where: {
      id: userId
    }
  }).then( (user) => {
    return done(null, {
      id: user.id,
      username: user.username
    });
  }).catch( (err) => {
    done(err, user);
  });
});


app.use(express.static('public'));


app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function (req, res) {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));


const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


app.use('/login', loginRouter);
app.use('/user', createRouter);
app.use('/', galleryRouter);


const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
});

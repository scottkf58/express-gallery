const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;
const db = require('./models');
const { Photo, User } = require('./models');
const config = require('./config/config.json');
const galleryRouter = require('./routes/gallery.js');
const createRouter = require('./routes/create.js');
const loginRouter = require('./routes/login.js');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const app = express();
app.use(bp.urlencoded());

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
      console.log('User exists in DB');
      if (user.password === password) {
        return done(null, user);
      } else {
        console.log('Password was incorrect');
        return done(null, false, { message: 'Incorrect Password' });
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

// Check if user is valid
function userAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is good');
    next();
  } else {
    console.log('User not good');
    res.redirect('/user');
  }
}

app.use(express.static('public'));


// Method Override
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function (req, res) {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Set up handlebars
const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.post('/login', passport.authenticate('local', {
  successRedirect: '/new',
  failureRedirect: '/user'
}));


app.get('/user', (req, res) => {
  res.render('user');
});

// Middleware
app.use('/user', loginRouter);
app.use('/user', createRouter);
app.use('/', galleryRouter);

const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
});

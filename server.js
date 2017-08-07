const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;
const db = require('./models');
const config = require('./config/config.json');
const galleryRouter = require('./routes/gallery.js');

const app = express();
app.use(bp.urlencoded());

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function (req, res) {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    // Look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/', galleryRouter);



const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
})

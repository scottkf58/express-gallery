const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const db = require('./models');
const config = require('./config/config.json');
const galleryRouter = require('./routes/gallery.js');

const app = express();
app.use(bp.urlencoded());

app.use('/', galleryRouter);

const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

const PORT = process.envPORT || 3000;


const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
})

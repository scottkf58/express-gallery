const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const db = require('./models');
const config = require('./config/config.json');


const hbs = exphbs.create( {
  defaultLayout : 'main',
  extname : 'hbs'
});

const PORT = process.envPORT || 3000;
const app = express();
app.use(bp.urlencoded());


const server = app.listen(PORT, () => {
  // Sync models folder
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
})

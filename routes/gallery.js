const express = require('express');
const router = express.Router();
const db = require('../models');
const Photo = db.Photo;

router.route('/gallery/new')
  .get( (req, res) => {
    console.log('new');
    res.render('/new');
  });


// Get/view gallery
router.route('/')
.get( (req, res) => {
  Photo.findAll()
    .then( (gallery) => {
      console.log(gallery);
      res.render('index', {gallery});
    })
    .catch( (err) => {
      console.log(err);
    });
  });


// POST to gallery
router.route('/gallery')
.post( (req, res) => {
  Photo.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  })
    .then( (data) => {
      console.log(data);
      res.end();
    })
    .catch( (err) => {
      console.log(err);
    });
  });

// Get by id
router.route('/gallery/:id')
.get( (req, res) => {
  Photo.findById(parseInt(req.params.id))
    .then( (getPhoto) => {
      res.render('getPhoto', {getPhoto});
    })
    .catch( (err) => {
      console.log(err);
    });
  })

// Edit id
.put( (req, res) => {
  Photo.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  }, {
    where: {
      id: req.params.id
    }
  })
  .then( (data) => {
    res.end();
  })
  .catch( (err) => {
    console.log(err);
  });
})

// Delete by id
.delete( (req, res) => {
  Photo.destroy({
    where: {
      id: req.params.id
    }
  })
  .then( (data) => {
    res.end();
  })
  .catch( (err) => {
    console.log(err);
  });
});



module.exports = router;
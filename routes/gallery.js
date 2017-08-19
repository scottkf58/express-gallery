const express = require('express');
const router = express.Router();
const db = require('../models');
const Photo = db.Photo;

// Send to new form
router.route('/new')
  .get( (req, res) => {
    res.render('new');
  });

// Send to create user/login form
router.route('/user')
  .get( (req, res) => {
    res.render('user');
  });

// Get all photos
router.route('/')
  .get( (req, res) => {
    Photo.findAll()
      .then( (photos) => {
        res.render('home', {photos});
      })
      .catch( (err) => {
        console.log(err);
      });
  });

// Post to gallery
router.route('/gallery')
  .post( (req, res) => {
    Photo.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    })
      .then( (data) => {
        res.redirect('/');
      })
      .catch( (err) => {
        console.log(err);
      });
  });

// Get by id
router.route('/gallery/:id')
  .get( (req, res) => {
    Photo.findById(parseInt(req.params.id))
      .then( (photo) => {
        res.render('photo', {photo});
      })
      .catch( (err) => {
        console.log(err);
      });
  })

  // Update Photo
  .put( (req, res) => {
    Photo.update({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    }, {
      returning: true,
      where: {
        id: req.params.id
      }
    })
    .then( (data) => {
      console.log('Updated photo');
    })
    .catch( (err) => {
      console.log(err);
    });
    res.redirect(`/gallery/${parseInt(req.params.id)}/edit`);
    res.end();
  })

  // Delete Photo
  .delete( (req, res) => {
    Photo.destroy({
      where: {
        id: req.params.id
      }
    })
    .then( (data) => {
      console.log('Deleted photo');
      res.redirect('/');
      res.end();
    })
    .catch( (err) => {
      console.log(err);
    });
  });

   // Send to edit form
   router.route('/gallery/:id/edit')
     .get( (req, res) => {
       Photo.findById(parseInt(req.params.id))
         .then( (editPhoto) => {
           res.render('edit', {editPhoto});
         })
         .catch( (err) => {
           console.log(err);
         });
     });


module.exports = router;
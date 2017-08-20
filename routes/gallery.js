const express = require('express');
const router = express.Router();
const db = require('../models');
const Photo = db.Photo;

const { photoMetas } = require('../collections/photoMeta.js');


// Send to new form
router.route('/new')
  .get( (req, res) => {
    res.render('new');
  });

// Send to create user/login form
router.route('/create')
  .get( (req, res) => {
    res.render('create');
  });

// Get all photos
router.route('/')
  .get( (req, res) => {
    Photo.findAll({
      order: [ [ "createdAt", "DESC"]]
    })
      .then( (photos) => {
        res.render('gallery', {photos});
      })
      .catch( (err) => {
        console.log(err);
      });
      // photoMetas().find().toArray()
      // .then(metas => {
      //   console.log(metas);
      // })
      // .catch( err => {
      //   console.log(err);
      // });
  });

// Post to gallery
router.route('/gallery')
  .post( (req, res) => {
    console.log(req.body);
    Photo.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    })
    .then( (data)=> {
        let metaObj = req.body.meta;
        metaObj.id = data.dataValues.id;
        photoMetas().insert(metaObj);
        res.redirect('/');
    })
    .catch( (err) => {
      console.log(err);
    });
  });

// Get by id
router.route('/gallery/:id', userAuthenticated)
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
    console.log(req.body);
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
   router.route('/gallery/:id/edit', userAuthenticated)
     .get( (req, res) => {
       Photo.findById(parseInt(req.params.id))
         .then( (editPhoto) => {
           res.render('edit', {editPhoto});
         })
         .catch( (err) => {
           console.log(err);
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


module.exports = router;
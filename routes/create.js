
const express = require('express');
const router = express('router');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models');
const { User } = db;

const saltRound = 10;

// Create/add new user to database
router.route('/')
  .post( (req, res) => {
    console.log('username:', req.body.username);
    console.log('password:', req.body.password);

    bcrypt.genSalt(saltRound)
      .then( (salt) => {
        bcrypt.hash(req.body.password, salt)
          .then( (hash) => {
            console.log(hash);
            User.create({
              username: req.body.username,
              password: hash
            }).then( () => {
              console.log('Inserted new user');
              res.end();
            }).catch( (err) => {
              console.log(err);
            });
          });
      })
      .catch( (err) => {
        console.log(err);
      });
    res.redirect('/');
  });


module.exports = router;


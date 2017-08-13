
const express = require('express');
const router = express('router');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const { User } = db;

// router.route('/')
//   .get((req, res) => {
//     res.render('login');
//   })
//   .post(passport.authenticate('local', {
//       successRedirect: '/gallery',
//       failureRedirect: '/login'
//     }));

router.route('/')
  .post( (req, res) => {
    console.log(req.body);
    User.create({
      username: req.body.username,
      password: req.body.password
    })
    .then( (data) => {
      res.redirect('/');
    })
    .catch( (err) => {
      console.log(err);
    });
  });


module.exports = router;


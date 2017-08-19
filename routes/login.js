const express = require('express');
const router = express('router');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const { User } = db;

// Authenticate user to post new photos
router.route('/')
  .post(passport.authenticate('local', {
    successRedirect: '/new',
    failureRedirect: '/user'
  }));

router.route('/logout')
  .get( (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

// Check if user is valid
// function userAuthenticated (req, res, next) {
//   if (req.isAuthenticated()) {
//     console.log('User is good');
//     next();
//   } else {
//     console.log('User not good');
//     res.redirect('/user');
//   }
// }


module.exports = router;
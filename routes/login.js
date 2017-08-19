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
    failureRedirect: '/create'
  }));

router.route('/logout')
  .get( (req, res) => {
    req.session.destroy();
    res.redirect('/create');
  });



module.exports = router;
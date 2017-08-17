const express = require('express');
const router = express('router');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const { User } = db;


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
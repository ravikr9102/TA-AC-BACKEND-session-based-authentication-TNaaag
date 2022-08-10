var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('register', { error });
});


function createUser(req, res, next) {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/login');
  });
}

router.post('/register', (req, res, next) => {
  console.log(req.body);
  var { email, password, age, phone } = req.body;
  console.log(req.body);
  if (email) {
    User.findOne({ email }, (err, user) => {
      if (err) return next(err);
      if (!user) {
        if (password.length <= 4) {
          req.flash('error', 'Password is Short');
          return res.redirect('/users/register');
        } else if (age <= 18) {
          req.flash('error', 'Age is below 18 your are not able sign in');
          return res.redirect('/users/register');
        } else if (phone.length < 10) {
          req.flash('error', 'Invalid Phone Number');
          return res.redirect('/users/register');
        } else if (!email.includes('@')) {
          req.flash('error', 'email is incorrect');
          return res.redirect('/users/register');
        } else {
          return createUser(req, res);
        }
      } else {
        req.flash('error', 'This email already registered & login here');
        return res.redirect('/users/login');
      }
    });
  } else {
    req.flash('error', 'Email required');
    return res.redirect('/users/register');
  }
});

router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/Password require');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    console.log(req.body);
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'User Not Found!!!');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Password is incorrect');
        return res.redirect('/users/login');
      }
    });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;

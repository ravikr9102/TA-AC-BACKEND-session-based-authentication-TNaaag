var express = require('express');
var router = express.Router();
var user = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  try {
    let newuser = await user.create(req.body);
    console.log(newuser, 'this is the created user');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

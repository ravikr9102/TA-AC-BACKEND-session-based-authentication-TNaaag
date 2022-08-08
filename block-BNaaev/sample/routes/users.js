var express = require('express');
var router = express.Router();
var user = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register',(req,res,next) => {
  res.render('register');
});

router.post('/register', (req,res,next) => {
  user.create(req.body,(err,user) => {
    console.log(err,user)
  });
});

module.exports = router;

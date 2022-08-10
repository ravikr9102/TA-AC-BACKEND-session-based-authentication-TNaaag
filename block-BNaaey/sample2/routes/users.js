var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  try {
    let newuser = await User.create(req.body);
    console.log(newuser, 'this is the created user');
  } catch (err) {
    next(err);
  }
});


router.get('/login', (req, res, next) => {
  res.render('login');
});



router.post('/login',(req,res,next) => {
  var { email, password } = req.body;
  if(!email || !password) {
   return res.redirect('/users/login')
  }
  User.findOne({ email }, (err,user) => {
    console.log(req.body)
    if(err) return next(err);
    if(!user){
       return res.redirect('/users/login');
    }
    user.verifyPassword (password,(err,result) => {
      if(err) return next(err)
      if(!result) {
        return res.redirect('/users/login')
      }
      req.session.userId = user.id;
      res.redirect('/users')
    })
  });
});

module.exports = router;

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
    return res.redirect('/users/login');
  } catch (err) {
    next(err);
  }
});

// login form
router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login', { error });
});


// login handler
router.post('/login',(req,res,next) => {
  var { email, password } = req.body;
  if(!email || !password) {
    req.flash('error','Email/password required');
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
      res.redirect('/users');
    });
  });
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login')
})

module.exports = router;

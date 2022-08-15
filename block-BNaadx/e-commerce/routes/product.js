var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');

// add product by
router.get('/new', (req, res, next) => {
  //console.log(req.session.userID)
  var userID = req.session.userID;
  User.findById(userID, (err, user) => {
    if (user.isAdmin === true) {
      return res.render('addProduct');
    } else {
      return res.redirect('/product');
    }
  });
});

router.post('/', (req, res) => {
  Product.create(req.body, (err, product) => {
    console.log(err, product);
    res.redirect('/product/new');
  });
});

// all product

router.get('/', (req, res) => {
  var userID = req.session.userID;
  var isAdmin = false;
  var isRegister = true;

  // if no user
  if (!userID) {
    isAdmin = false;
    isRegister = false;
  }

  // if user is register
  if (isRegister === true) {
    User.findById(userID, (err, user) => {
      console.log(user.isAdmin, 'admin login');
      if (user.isAdmin === true) {
        isAdmin = true;
      }
    });
  }

  Product.find({}, (err, products) => {
    //console.log(err ,products)

    res.render('products', { products, isAdmin, isRegister });
  });
});

// edit by admin
router.get('/:id/edit', (req, res) => {
  var id = req.params.id;
  var userID = req.session.userID;
  User.findById(userID, (err, user) => {
    if (user.isAdmin === true) {
      Product.findById(id, (err, product) => {
        res.render('editProduct', { product: product });
      });
    }
  });
});

router.post('/:id/edit', (req, res) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, updateProduct) => {
    console.log(updateProduct, 'update product');
    res.redirect('/product');
  });
});

// deldte by admin

router.get('/:id/delete', (req, res) => {
  var userID = req.session.userID;
  var id = req.params.id;
  console.log(userID, 'user id');
  console.log(id, 'id');
  User.findById(userID, (err, user) => {
    console.log(user);
    if (user.isAdmin === true) {
      Product.findByIdAndDelete(id, (err, delProduct) => {
        console.log(err, delProduct);
        res.redirect('/product');
      });
    }
  });
});

// likes by user
router.get('/:id/likes', (req, res) => {
  var id = req.params.id;
  var userID = req.session.userID;
  User.findById(userID, (err, user) => {
    console.log(user.isAdmin, 'likes user');
    if (user.isAdmin === false) {
      Product.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, uplikes) => {
        console.log(uplikes, 'update likes');
      });
      res.redirect('/product');
    }
  });
});

// deslike by user
router.get('/:id/dislikes', (req, res) => {
  var id = req.params.id;
  var userID = req.session.userID;
  User.findById(userID, (err, user) => {
    //console.log(user,"deslikes user")
    if (user.isAdmin === false) {
      Product.findById(id, (err, uplikes) => {
        if (uplikes.likes > 0) {
          Product.findByIdAndUpdate(
            id,
            { $inc: { likes: -1 } },
            (err, updateProduct) => {
              console.log(uplikes, 'down likes');
              res.redirect('/product');
            }
          );
        } else {
          res.redirect('/product');
        }
      });
    }
  });
});

module.exports = router;

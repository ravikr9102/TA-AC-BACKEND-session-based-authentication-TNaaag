var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var userSchema = new schema(
  {
    Name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, minlength: 5, required: true },
    city: { type: String, required: true },
    isAdmin: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

// bcrypt password
userSchema.pre('save', function (next) {
  
  // all admin
  let allAdmin = ['ravi@gmail.com', 'suraj@gmail.com'];

  if (allAdmin.includes(this.email)) {
    this.isAdmin = true;
  } else {
    this.isAdmin = false;
  }

  //hasing the password
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      console.log(hash);
      if (err) return next(err);
      this.password = hash;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
}

module.exports = mongoose.model('User', userSchema);

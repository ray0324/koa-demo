const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const saltRounds = 10;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true
  },
  mobile: String,
  password: String
});

userSchema.pre('save', function(next) {
  // const user = this;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePwd = function(candidate, cb) {
  bcrypt.compare(candidate, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    cb(null, isMatch);
  });
};

const User = mongoose.model('user', userSchema);

module.exports = User;

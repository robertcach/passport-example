const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'name is required',
    minlength: [3, 'name needs at least 3 chars']
  },
  email: {
    type: String,
    required: 'email is required',
    match: [EMAIL_PATTERN, 'email is not valid'],
    unique: true
  },
  password: {
    type: String,
    required: 'password is required',
    match: [PASSWORD_PATTERN, 'password needs at least 8 chars']
  },
  googleID: {
    type: String
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/robertcach/image/upload/v1644667037/ironhack/default-avatar_olia0m.png'
  },
  active: {
    type: Boolean,
    default: false
  },
  activationToken: {
    type: String,
    default: () => {
      return Math.random().toString(36).substring(7) +
      Math.random().toString(36).substring(7) +
      Math.random().toString(36).substring(7) +
      Math.random().toString(36).substring(7)
    }
  }
});


userSchema.pre('save', function(next) { // No es arrow function porque no se podría acceder a "this"
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch(err => next(err))
  } else {
    next();
  }
})

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User;

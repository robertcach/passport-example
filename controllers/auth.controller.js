const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User.model');


module.exports.register = (req, res, next) => {
  res.render('auth/register')
}

module.exports.login = (req, res, next) => {
  res.render('auth/login')
}

module.exports.doRegister = (req, res, next) => {
  const user = req.body; // req.body = la información del formulario

  const renderWithErrors = (errors) => {
    res.render('auth/register', { errors, user }) // "errors" es un objeto
  }

  User.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound) {
        renderWithErrors({ email: 'Email already in user' }) // email es una clave del objeto "errors"
      } else {
        return User.create(user)
          .then(() => {
            res.redirect('/login')
          })
      }
    })
    .catch(err=> {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    })
}
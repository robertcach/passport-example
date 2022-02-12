const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User.model');
const mailer = require('../config/mailer.config')


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
          if (req.file){ // "req.file" contien las imágenes subidas al formulario
            user.image = req.file.path
          }
          return User.create(user)
            .then((createdUser) => {
              mailer.sendActivationMail(createdUser.email, createdUser.activationToken)
              // Llamamos a la función "sendActivationMail" pasando como parámetros los valores de las clave "email" y "activatioToken" del usuario que ha creado
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


// Función Login
const doLogin = (req, res, next, provider = 'local-auth') => {
  passport.authenticate(provider, (err, user, validations) => {
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errorMessage: validations.error })
    } else {
      req.login(user, (loginError) => {
        console.log({user});
        if (loginError) {
          next(loginError)
        } else {
          req.flash('flashMessage', 'You have succesfully signed in')
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
}


module.exports.doLogin = (req, res, next) => {
  doLogin(req, res, next)
}

module.exports.doLoginGoogle = (req, res, next) => {
  doLogin(req, res, next, 'google-auth')
}


module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}

module.exports.active = (req, res, next) => {
  const activationToken = req.params.token;

  User.findOneAndUpdate(
    { activationToken, active: false }, // Busca al usuario que cumple con esos dos parámetros de búsqueda
    { active: true } // Luego cambia el valor de "active" a "true".
  )
  .then(() => {
    req.flash('flashMessage', 'You have activated your account. Welcome!')
    res.redirect('/login')
  })
  .catch(err => next(err))
}
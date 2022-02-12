const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email" 
];

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', authMiddleware.isNotAuthenticated, authController.register); // Para declarar estas rutas, antes hay que crear el controlador correspondiente
router.post('/register', authMiddleware.isNotAuthenticated, authController.doRegister);
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin);
router.get('/login', authMiddleware.isNotAuthenticated, authController.login); // Para declarar estas rutas, antes hay que crear el controlador correspondiente
router.get('/logout', authMiddleware.isAuthenticated, authController.logout)

router.get('/login/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }));
router.get('/auth/google/callback', authController.doLoginGoogle)

router.get('/profile', authMiddleware.isAuthenticated, usersController.profile);


module.exports = router;
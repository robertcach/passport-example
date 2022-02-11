const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', authController.register); // Para declarar estas rutas, antes hay que crear el controlador correspondiente
router.post('/register', authController.doRegister);
router.post('/login', authController.doLogin);
router.get('/login', authController.login); // Para declarar estas rutas, antes hay que crear el controlador correspondiente

router.get('/profile', usersController.profile);


module.exports = router;
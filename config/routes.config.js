const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller')

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', authController.register); // Para declarar estas rutas, antes hay que crear el controlador correspondiente
router.post('/register', authController.doRegister)
router.get('/login', authController.login) // Para declarar estas rutas, antes hay que crear el controlador correspondiente


module.exports = router;
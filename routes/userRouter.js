const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

//Route: POST signup (/api/auth/signup)
router.post('/signup', userCtrl.signup);

//Route: POST login (/api/auth/login)
router.post('/login', userCtrl.login);

//Route: PUT (/api/auth/:id)
router.put('/:id', auth, userCtrl.modifyUser);

//Route: DELETE (/api/auth/:id)
router.delete('/:id', auth, userCtrl.deleteUser);

module.exports = router;
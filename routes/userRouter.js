const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

//Route: POST signup (/api/auth/signup)
router.post('/signup', userCtrl.signup);

//Route: POST login (/api/auth/login)
router.post('/login', userCtrl.login);

//Route: GET profil (/api/auth/profil)
router.get('/profil',auth,userCtrl.getUserInfo);

//Route: PUT (/api/auth/profil)
router.put('/profil', auth, userCtrl.modifyUser);

//Route: DELETE (/api/auth/profil)
router.delete('/profil', auth, userCtrl.deleteUser);

//Routes Admin-------------
router.get('/admin/user/:id',auth,userCtrl.getUserInfo);

//Route: PUT (/api/auth/:id)
router.put('/admin/user/:id', auth, userCtrl.modifyUser);

//Route: DELETE (/api/auth/:id)
router.delete('/admin/user/:id', auth, userCtrl.deleteUser);

module.exports = router;
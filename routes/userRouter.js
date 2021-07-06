const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//Route: POST signup (/api/auth/signup)
router.post('/signup', userCtrl.signup);

//Route: POST login (/api/auth/login)
router.post('/login', userCtrl.login);

//Route: GET profil (/api/auth/profil)
router.get('/profil',auth,userCtrl.getMyProfil);

//Route: PUT (/api/auth/profil)
router.put('/profil', auth, userCtrl.modifyMyProfil);

//Route: DELETE (/api/auth/profil)
router.delete('/profil', auth, userCtrl.deleteMyProfil);

//ADMIN Routes---------------------------
//Route: GET (/api/auth/user/:id)
router.get('/user/:id',auth, admin, userCtrl.getUserInfo);

//Route: PUT (/api/auth/user/:id)
router.put('/user/:id', auth, admin, userCtrl.modifyUser);

//Route: DELETE (/api/auth/user/:id)
router.delete('/user/:id', auth, admin, userCtrl.deleteUser);

module.exports = router;
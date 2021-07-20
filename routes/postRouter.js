const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postCtrl = require('../controllers/postCtrl');
const multer = require('../middleware/multer-config');

//Route: POST: create a Post (/api/post)
router.post('/', auth, multer, postCtrl.newPost);

//Route: GET: get a Post (/api/post)
router.get('/:id', auth, postCtrl.getOnePost);

//Route: GET: get all Posts (/api/post)
router.get('/', auth, postCtrl.getAllPosts);

//Route: PUT: update a Post (/api/post)
router.put('/:id', auth, multer, postCtrl.modifyPost);

//Route: DELETE: delete a Post (/api/post)
router.delete('/:id', auth, postCtrl.deleteOnePost);

module.exports = router;
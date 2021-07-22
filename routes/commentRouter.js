const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/commentCtrl');

//Route: POST: create a Comment (/api/comment)
router.post('/', auth, commentCtrl.newComment);

//Route: GET: get a Comment (/api/comment/:id)
router.get('/:id', auth, commentCtrl.getOneComment);

//Route: GET: get all Comments (/api/comment/)
router.get('/', auth, commentCtrl.getAllComments);

//Route: GET: get all Comments of a Post (/api/comment/post/:id)
router.get('/post/:id', auth, commentCtrl.getAllCommentsOfAPost);

//Route: PUT: update a Comment (/api/comment/:id)
router.put('/:id', auth, commentCtrl.modifyComment);

//Route: DELETE: delete a Comment (/api/comment/:id)
router.delete('/:id', auth, commentCtrl.deleteOneComment);

module.exports = router;
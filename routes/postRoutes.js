const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/checkUser');
const postController = require('../controllers/postController')

router.post('/addPost', checkUser, postController.addPost)
router.post('/deletePost', checkUser, postController.deletePost)
router.post('/editPost', checkUser, postController.editPost)
router.post('/likePost', checkUser, postController.likePost)

module.exports = router
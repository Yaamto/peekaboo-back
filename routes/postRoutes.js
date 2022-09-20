const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/checkUser');
const postController = require('../controllers/postController')

//POST
router.post('/addPost', checkUser, postController.addPost)
router.post('/deletePost', checkUser, postController.deletePost)
router.put('/editPost', checkUser, postController.editPost)
router.post('/likePost', checkUser, postController.likePost)



//GET
router.get('/singlePost/:post_id', postController.singlePost)



module.exports = router
const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/checkUser');
const postController = require('../controllers/postController')

//POST
router.post('/addPost', checkUser, postController.addPost)
router.post('/deletePost/:id', checkUser, postController.deletePost)
router.put('/editPost/:id', checkUser, postController.editPost)
router.post('/likePost/:id', checkUser, postController.likePost)



//GET
router.get('/singlePost/:post_id', postController.singlePost)
router.get('/feed/:page', checkUser, postController.feed)



module.exports = router
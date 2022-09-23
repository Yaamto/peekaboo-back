const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/checkUser');
const commentController = require('../controllers/commentController')

router.post("/addComment/:post", checkUser, commentController.addComment)
router.delete("/deleteComment/:comment", checkUser, commentController.deleteComment)
router.get("/postComments/:post", checkUser, commentController.getCommentsByPost)

module.exports = router
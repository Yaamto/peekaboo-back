const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/checkUser');
const chatController = require('../controllers/chatController')

router.post("/addChat", checkUser, chatController.addChat)
router.get("/getAllChats", checkUser, chatController.getAllChats)


module.exports = router

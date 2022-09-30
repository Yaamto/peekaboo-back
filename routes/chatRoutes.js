const express = require('express');
const router = express.Router();
const { checkUser } = require('../middleware/checkUser');
const chatController = require('../controllers/chatController')
const messageController = require('../controllers/messageController')

// Chats
router.post("/addchat", checkUser, chatController.addChat)
router.get("/getallchats", checkUser, chatController.getAllChats)

// Messages
router.post("/addmessage", checkUser, messageController.addMessage)


module.exports = router

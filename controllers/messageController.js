const { Chat } = require("../models/chatModel")
const { User } = require("../models/userModel")
const { Message } = require("../models/messageModel")
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.addMessage = async(req,res) => {

    const chat = ObjectId.isValid(req.body.chat) ? await Chat.findById(req.body.chat): null
    const { content } = req.body
    if(chat) {
        try {
            if(chat.users.some((user) => user._id.valueOf() === res.locals.user._id.valueOf())) {
                await Message.create({
                    chat_id : chat._id,
                    sender_id: res.locals.user._id,
                    content: content ? content : null
                }).then(async(message) => {
                    await Chat.findOneAndUpdate({_id: chat._id}, {latestMessage: message._id}).then((chatResponse) => {
                        res.status(200).json({msg: 'Message sent, and last message updated', message: message})
                    })
                    
                })
            } else {
                res.status(401).json({error: 'This isn\'t your chat. Go find friends'})
            }
        }catch(err) {
            res.status(404).json(err)
        }

    } else {
        res.status(406).json({error: "No chat found. Chat hasn't been created"})
    }

}
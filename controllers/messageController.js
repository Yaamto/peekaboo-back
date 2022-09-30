const { Chat } = require("../models/chatModel")
const { User } = require("../models/userModel")
const { Message } = require("../models/messageModel")
const {mediaHandler} = require("../tools/customFunctions");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.addMessage = async(req,res) => {
    const id = res.locals.user._id
    const chat = ObjectId.isValid(req.body.chat) ? await Chat.findById(req.body.chat): null
    const media = req.files ? req.files.media : null
    const content = req.body.content ? req.body.content : null
    if(chat) {
        try {
            if(chat.users.some((user) => user._id.valueOf() === res.locals.user._id.valueOf())) {
                if(content != null || media != null ) {
                    await Message.create({
                        chat_id : chat._id,
                        sender_id: res.locals.user._id,
                        content: req.body.content ? req.body.content : ""
                    }).then(async(message) => {
                        if(media != null) {
                            console.log("update du message en cours...")
                            await Message.updateOne({_id: message._id}, {media: mediaHandler(req.files.media, message._id, id, 'message')})
                        }
                        await Chat.findOneAndUpdate({_id: chat._id}, {latestMessage: message._id}).then(() => {
                            res.status(200).json({msg: 'Message sent, and last message updated', message: message})
                        })
                        
                    })
                } else {
                    res.status(404).json({error: 'Provide at least a message or a media'})
                }
                
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
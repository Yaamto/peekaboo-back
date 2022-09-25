const { Chat } = require("../models/chatModel")
const { User } = require("../models/userModel")
const {isEmpty} = require("../config/customFunction")



module.exports.addChat = async(req,res) => {
    const userChat = req.body.userChat

    const UserToSend = await User.findById(userChat)
    console.log(UserToSend)
    try {
        const isChat = await Chat.find({
            isGroupChat: false,
            $and: [
              { users: { $elemMatch: { $eq: res.locals.user._id } } },
              { users: { $elemMatch: { $eq: UserToSend._id } } },
            ],
          })
          console.log(isChat)
        if(isChat.length === 0){
           const chatData = {
                isGroupChat: false,
                users: [res.locals.user._id, UserToSend._id],
              };
              const createdChat = await Chat.create(chatData);
              res.status(200).json({data: createdChat})
        }else {
            res.status(403).json({error: "You already got a Chat with this user"})
        }
    }
    catch(err){
        res.status(404).json(err)
    }
    
}

module.exports.getAllChats = async(req, res) => {
    const user = res.locals.user._id

    try {
        const data = await Chat.find({ users: { $elemMatch: { $eq: res.locals.user._id } } })
        if(data){
            res.status(200).json({data: data})
        } else {
            res.json({message: "You don't have any chat yet"})
        }
    }
    catch(err){
        res.status(404).json(err)
    }
}
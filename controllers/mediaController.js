const { Post } = require("../models/postModel")
const { User } = require("../models/userModel")
const fs = require("fs");
const rootDir = require('path').resolve('./');

module.exports.GetMedia = async(req, res) => {

    let {user, postorpp, media} = req.params
    let path = rootDir+ `/media/${user}/${postorpp}/${media}`

    if(fs.existsSync(path)) {
        res.sendFile(path);
    } else {
        res.status(401).json({error: 'File not found'})
    }
}

module.exports.getDefault = async(req,res) => {
    
    let path = rootDir+'/media/defaultuser.png'

    if(fs.existsSync(path)) {
        res.sendFile(path);
    } else {
        res.status(401).json({error: 'File not found'})
    }
}
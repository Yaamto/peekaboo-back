const User = require("../models/userModel").User


module.exports.deleteUser = async(req,res) => {
    const id = req.params.id
    try {

        const data = await User.findByIdAndDelete({_id: id})
        
        if(data){
            res.status(200).send({deleted : data})
        } else{
            res.status(404)
        }
    }
    catch(err){
        res.status(404).send({err: err})
    }

}

module.exports.editUserBio = async(req,res) => {
    const  bio = req.body.bio
    const id = req.params.id
    try {
      const data = await User.findByIdAndUpdate(
        {_id: id},
        {
            $set: {
                bio: bio
            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true}
       )
       if (data){
        res.json(data)
       }else {
        res.json(err)
       }
    }
    catch(err){
        res.status(404).send({err: err})
    }
}

module.exports.editUserProfilePic = async(req,res) => {
    const  profilePic = req.body.profilePic
    const id = req.params.id
    try {
      const data = await User.findByIdAndUpdate(
        {_id: id},
        {
            $set: {
                profilePic: profilePic
            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true}
       )
       if (data){
        res.json(data)
       }else {
        res.json(err)
       }
    }
    catch(err){
        res.status(404).send({err: err})
    }
}
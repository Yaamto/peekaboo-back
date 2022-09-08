const User = require("../models/userModel").User


module.exports.deleteUser = async(req,res) => {
    const id = req.body.id
    try {

        const data = await User.findByIdAndDelete({_id: id})
        
        if(data){
            res.status(200).send({deleted : data})
        } else{
            res.status(404)
        }
    }
    catch(err){
        console.log(err)
    }

}
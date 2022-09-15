const User = require("../models/userModel").User
const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports.register = (req, res) => {
    
    User.findOne({email: req.body.email}).then((user) => {
        
        if(user){
            const error = "A user is already register with this email"
            return res.status(409).send({error})
        }else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            })
            newUser.save()
            return res.status(200).json({msg: newUser})
        }
    })
}

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
    
  return jwt.sign({id}, process.env.TOKEN_SECRET, {
      
    expiresIn: maxAge
  })
  
  
};

module.exports.login = async(req,res) => {

    const { email, password } = req.body
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge});
        res.status(200).json({ user: user, token : token})
      }
      catch(err) {
          console.error(err)
        res.status(400).json({ error : err});
      }
}

module.exports.logout = async(req,res) => {

    res.cookie('jwt', '', { maxAge: 1 });  
                         
   res.json({success: "successfully logout"})
}


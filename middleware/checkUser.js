const jwt = require('jsonwebtoken')
const User = require('../models/userModel').User

module.exports.checkUser = async(req, res, next) => {

    const token = req.cookies.jwt
    console.log(token)
    
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {

      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        return res.send('token not available or expired')
      } else {

        const user = await User.findById(decodedToken.id).select("-password");
        res.locals.user = user;
        if (res.locals.user) {
          next();
        } else {
          res.cookie("jwt", "", { maxAge: 1 });
          return res.send("u are not connected")

        }
      }
    });
  } else {
    res.locals.user = null;
 
    return res.json({ msg: "pas de token" })

  }
}

const express = require('express');
require('dotenv').config()
require('./config/config')
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const { requireAuth, checkUser, checkAdmin } = require('./middleware/auth');
const app = express()


app.use(
    cors({
      origin: (origin, callback) => callback(null, true),
      credentials: true,
    })
  );
  

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())


// app.get("/jwtid", checkUser, (req, res) => {
//    return res.status(200).json({user : res.locals.user})
//    });

//    app.get("/jwtid/admin", checkAdmin, (req, res) => {
//     return res.status(200).json({user : res.locals.user})
//     });



app.listen(3000, () => console.log("serveur running on port 3000"));
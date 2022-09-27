const express = require('express');
require('dotenv').config()
require('./config/config')
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const commentRoutes = require("./routes/commentRoutes")
const chatRoutes = require("./routes/chatRoutes")
// const { requireAuth, checkUser, checkAdmin } = require('./middleware/auth');
const app = express()

app.use(fileUpload());
app.use(
    cors({
      origin: (origin, callback) => callback(null, true),
      credentials: true,
    })
  );
  

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"));


// app.get("/jwtid", checkUser, (req, res) => {
//    return res.status(200).json({user : res.locals.user})
//    });

//    app.get("/jwtid/admin", checkAdmin, (req, res) => {
//     return res.status(200).json({user : res.locals.user})
//     });
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/post", postRoutes)
app.use("/comment", commentRoutes)
app.use("/chat", chatRoutes)


app.listen(3000, () => console.log("serveur running on port 3000"));

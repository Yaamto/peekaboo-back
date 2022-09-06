const mongoose = require("mongoose");
require('dotenv').config()

mongoose
  .connect(
    "mongodb+srv://" + process.env.DB_PASS +"@cluster0.ivelk.mongodb.net/peakaboo",
    {
      useNewUrlParser: true,
   
    })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
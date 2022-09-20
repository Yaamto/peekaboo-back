const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const { checkUser } = require('../middleware/checkUser');



router.delete("/delete", checkUser ,userController.deleteUser)
router.get("/getsingle/:id", userController.getSingleUser)
router.put("/editbio", checkUser, userController.editUserBio)
router.get("/users", checkUser, userController.getAllUsers)
router.put("/addprofilepic", checkUser, userController.addProfilePic)
router.patch("/follow/:id", checkUser, userController.follow)
router.post("/repost/:post_id", checkUser, userController.repost)

module.exports = router
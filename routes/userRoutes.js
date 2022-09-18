const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const { checkUser } = require('../middleware/checkUser');



router.delete("/delete", userController.deleteUser)
router.get("/getsingle/:id", userController.getSingleUser)
router.put("/editbio/:id", userController.editUserBio)
router.put("/editprofilepic/:id", userController.editUserProfilePic)
router.get("/users", userController.getAllUsers)
router.put("/addProfilePic", checkUser, userController.addProfilePic)
router.patch("/follow/:id", checkUser, userController.follow)
router.post("/repost/:post_id", checkUser, userController.repost)

module.exports = router
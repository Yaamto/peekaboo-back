const express = require('express');

const router = express.Router();

const userController = require("../controllers/userController")

router.delete("/delete", userController.deleteUser)
router.put("/editbio/:id", userController.editUserBio)
router.put("/editprofilepic/:id", userController.editUserProfilePic)
router.get("/users", userController.getAllUsers)

module.exports = router
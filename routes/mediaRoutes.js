const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController')

router.get("/media/:user/:postorpp/:media", mediaController.GetMedia)
router.get("/image/defaultuser.png", mediaController.getDefault)


module.exports = router
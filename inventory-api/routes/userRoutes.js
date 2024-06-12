const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authentication = require("../middleware/authMiddlware");


router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", authentication, userController.logout);
router.get("/profile", authentication, userController.getUserProfile);

module.exports = router;
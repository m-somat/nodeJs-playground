const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth.js");

const userController = require("../controllers/user.js");

router.post("/signup", userController.user_signup);
router.post("/login", userController.user_login);
router.post("/logout", checkAuth, userController.user_logout);
router.delete("/:userId", checkAuth, userController.user_delete_user);

module.exports = router;

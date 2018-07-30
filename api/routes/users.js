const express = require("express");
const router = express.Router();
const checkAuth = require("../jwt/check-auth");

const userController = require("../controllers/user");

router.post('/signup', userController.signup);
router.get("/", userController.getAll);
router.post("/login", userController.login);
router.delete("/:userId", checkAuth, userController.delete);

module.exports = router;
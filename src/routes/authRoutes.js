const express = require("express");

const authController = require("../controllers/authController");
const { validateLogin, validateRegister } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);

module.exports = router;

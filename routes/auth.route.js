const controller = require("../controllers/auth.controller");
const validation = require("../validations/auth.validation");
const express = require("express");
const router = express.Router();

router.post("/register", validation.authRegister(), controller.register);
router.post("/login", controller.login);

module.exports = router;

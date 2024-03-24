const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth_controller.js");
const signupSchema = require("../validators/auth-validators.js");
const validate = require("../middlewares/validate-middleware.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

router.get("/", auth.home);
router.post("/register", validate(signupSchema), auth.registration); 
router.post("/login", auth.login);
router.get("/user", authMiddleware, auth.user);
router.post("/forget-password", auth.emailController);
router.post("/verify-otp", auth.OTP);
router.post("/changePassword", auth.changePassword);

module.exports = router;

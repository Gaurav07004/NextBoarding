const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth_controller.js");
const signupSchema = require("../validators/auth-validators.js");
const validate = require("../middlewares/validate-middleware.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

// Public Routes
router.get("/", auth.home);
router.post("/register", validate(signupSchema), auth.registration); 
router.post("/login", auth.login);
router.post("/forget-password", auth.emailController);
router.post("/verify-otp", auth.OTP);
router.post("/changePassword", auth.changePassword);

router.post("/checkout", auth.paymentGateway);

// Protected Routes (Require Authentication)
router.use(authMiddleware); // Apply authentication middleware for all routes below
router.get("/user", auth.user);
router.post("/RouteData", auth.storeRouteData);
router.post("/PassengerData", auth.storePassengerData);
router.put("/AccountData", auth.AccountData);

module.exports = router;

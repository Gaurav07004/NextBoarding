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

// Protected Routes (Require Authentication)
router.use(authMiddleware);
router.get("/user", auth.user);
router.post("/RouteData", auth.storeRouteData);
router.post("/PassengerData", auth.storePassengerData);
router.post("/checkout", auth.paymentGateway);
router.put("/AccountData", auth.AccountData);
router.delete("/DeleteAccount", auth.DeleteAccount);
router.put("/cancelTrips/:route_Id/:passengerId", auth.CancelTrip);
//router.get("/trips/:id", auth.getTripById);


module.exports = router;

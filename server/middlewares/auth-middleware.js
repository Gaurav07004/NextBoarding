// const jwt = require("jsonwebtoken");
// const User = require("../models/user_model");

// const authMiddleware = async (req, res, next) => {
//     const token = req.header("Authorization");

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized, Token not provided" });
//     }
    
//     try {
//         // Verify and decode the JWT token
//         const jwtToken = token.replace("Bearer ", "").trim();
//         const decodedToken = jwt.verify(jwtToken, process.env.JWT_SEC_KEY);

//         // Extract user ID from the decoded token
//         const userId = decodedToken.userId;

//         const userData = await User.findById(userId).select({ password: 0 });

//         if (!userData) {
//             return res.status(401).json({ message: "Unauthorized, User not found" });
//         }

//         req.user = userData;
//         req.token = jwtToken;
//         req.userId = userId;

//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Unauthorized, Invalid Token" });
//     }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const RouteData = require("../models/route_model");
const PassengerData = require("../models/passenger_model.js");
const Payment = require("../models/payment_model.js"); 

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, Token not provided" });
    }
    
    try {
        // Verify and decode the JWT token
        const jwtToken = token.replace("Bearer ", "").trim();
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_SEC_KEY);

        // Extract user ID from the decoded token
        const userId = decodedToken.userId;

        const userData = await User.findById(userId).select({ password: 0 });

        if (!userData) {
            return res.status(401).json({ message: "Unauthorized, User not found" });
        }

        // Fetch additional data related to the user from other collections/models
        const routeData = await RouteData.find({ user_Id: userId });
        const passengerData = await PassengerData.find({ user_Id: userId });
        const paymentData = await Payment.find({ user_Id: userId });

        // Attach fetched data to the request object
        req.user = userData;
        req.token = jwtToken;
        req.userId = userId;
        req.routeData = routeData; 
        req.paymentData = paymentData; 
        const routeIds = routeData.map(route => route._id);
        req.routeIds = routeIds;
        req.passengerData = passengerData;
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, Invalid Token" });
    }
};

module.exports = authMiddleware;


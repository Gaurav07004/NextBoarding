const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user_model.js");
const RouteData = require("../models/route_model.js");
const PassengerData = require("../models/passenger_model.js");
const Payment = require("../models/payment_model.js");
//const razorpay = require("../middlewares/auth-payment.js");

const home = async (req, res) => {
    try {
        res.status(200).send("Welcome");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Internal Server Error");
    }
};

const registration = async (req, res) => {
    try {
        const { fullName, email, password, PhoneNumber = "", MaritalStatus = "", Gender = "", Address = "", profileImage = "" } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const newUser = await User.create({ fullName, email, password, PhoneNumber, MaritalStatus, Gender, Address, profileImage });
        const token = await newUser.generateToken();
        res.status(200).json({ newUser, token, userId: newUser._id.toString() });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const verifyPassword = await bcrypt.compare(password, userExist.password);
        if (verifyPassword) {
            const token = await userExist.generateToken();
            res.status(201).json({ msg: "Login Successful", token, userId: userExist._id.toString() });
        } else {
            res.status(401).json({ error: "Invalid Email or Password" });
        }
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

// const user = async (req, res) => {
//     try {
//         const userData = req.user;
//         return res.status(200).json({ userData });
//     } catch (error) {
//         console.error("Error from the user route:", error.message);
//         res.status(500).json("Internal Server Error");
//     }
// };

const user = async (req, res) => {
    try {
        const userId = req.user._id;
        let routeData = await RouteData.find({ user_Id: userId });
        let passengerData = await PassengerData.find({ user_Id: userId });

        const currentDate = new Date();

        passengerData = await Promise.all(
            passengerData.map(async (passengerRoute) => {
                const routeId = passengerRoute.route_Id.toString(); // Convert ObjectId to string
                
                const route = routeData.find(route => route._id.toString() === routeId); // Convert route _id to string for comparison
                
                if (route) {
                    const travelDate = new Date(route.travel_Date);
                    passengerRoute.passengers = passengerRoute.passengers.map(passenger => {
                        if (passenger.status !== "Cancelled") {
                            if (travelDate > currentDate) {
                                passenger.status = "Upcoming";
                            } else {
                                passenger.status = "Completed";
                            }
                        }
                        return passenger;
                    });
                }
                await passengerRoute.save(); // Saving updated passenger data
                return passengerRoute;
            })
        );

        const paymentData = await Payment.find({ user_Id: userId });

        const userData = {
            user: req.user,
            routeData,
            passengerData,
            paymentData,
        };

        return res.status(200).json(userData);
    } catch (error) {
        console.error("Error from the user route:", error.message);
        res.status(500).json("Internal Server Error");
    }
};

const sendEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const otp = generateOTP();
        const emailContent = `<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f0f0; border-radius: 1rem;">
            <h2 style="font-size: 24px; font-weight: bold; line-height: 28px;">Action Required: One-Time Verification Code</h2>
            <p style="font-size: 14px;">You are receiving this email because a one-time verification code is required for your NextBoarding account.</p>
            <p style="font-size: 14px;">Please use the following code to complete the verification process: <strong style="font-weight: bold; color: #007bff;">${otp}</strong></p>
            <p style="font-size: 14px;">If you did not request this verification code, please ignore this email.</p>
            <p style="font-size: 14px;">If you need any assistance or have questions, feel free to contact our support team at <a href="mailto:${process.env.EMAIL_USER}" style="color: #007bff; text-decoration: none;">NextBoarding Team</a>.</p>
            <p style="font-size: 14px;">Thank you,<br>NextBoarding Team</p>
        </div>`;

        const info = await transporter.sendMail({
            from: {
                name: "NextBoarding",
                address: process.env.EMAIL_USER,
            },
            to: email,
            subject: "One-Time Verification Code - Action Required",
            html: emailContent,
        });

        console.log("Message sent: %s", info.messageId);
        return otp;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("An error occurred while sending the email.");
    }
};

const generateOTP = () => {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

const emailController = async (req, res) => {
    const { email } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
        return res.status(400).json({ error: "User Not Found" });
    }
    try {
        const otp = await sendEmail(email);
        res.status(200).json({ message: "Password reset instructions sent to your email.", otp });
    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ error: "An error occurred while sending the email." });
    }
};

const OTP = async (req, res) => {
    const { otp: userOTP } = req.body;
    const generatedOTP = req.generatedOTP;

    if (userOTP === generatedOTP) {
        res.status(200).json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ error: "Invalid OTP" });
    }
};

const changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (currentPassword) {
            const verifyPassword = await bcrypt.compare(currentPassword, user.password);
            if (!verifyPassword) {
                return res.status(400).json({ error: "Invalid current password" });
            }
        }

        const hashpassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(user._id, { password: hashpassword });

        return res.status(200).json({ message: "Password update successfully" });
    } catch (error) {
        console.error("Error changing password:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const storeRouteData = async (req, res) => {
    try {
        const user_Id = req.user._id;

        const {
            departure_City,
            departure_Airport,
            arrival_City,
            arrival_Airport,
            travel_Date,
            traveller_Number,
            traveller_Class,
            fare_Type,
            airline_Name,
            flight_Number,
            departure_Time,
            arrival_Time,
            total_duration,
            stop,
        } = req.body;

        const newRoute = new RouteData({
            user_Id,
            departure_City,
            departure_Airport,
            arrival_City,
            arrival_Airport,
            travel_Date,
            traveller_Number,
            traveller_Class,
            fare_Type,
            airline_Name,
            flight_Number,
            departure_Time,
            arrival_Time,
            total_duration,
            stop,
        });

        await newRoute.save();

        res.status(201).json({ message: "Route data stored successfully" });
    } catch (error) {
        console.error("Error storing route data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const storePassengerData = async (req, res) => {
    try {

        const user_Id = req.user._id;
        const route_Id = req.routeIds[req.routeIds.length - 1]
        const { passengers, emergencyContacts, checked_Bags } = req.body;

        // Create a new instance of Booking model
        const newBooking = new PassengerData({
            user_Id,
            route_Id,
            passengers,
            emergencyContacts,
            checked_Bags,
        });

        await newBooking.save();

        res.status(201).json({ message: "Booking data stored successfully" });
    } catch (error) {
        console.error("Error storing booking data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const paymentGateway = async (req, res) => {
    try {
        const user_Id = req.user._id;
        const { card_Name, card_Number, expire_date, ccv } = req.body.payments;

        const newPayment = new Payment({
            user_Id,
            card_Name: card_Name,
            card_Number: card_Number,
            expire_date: expire_date,
            ccv: ccv,
        });

        await newPayment.save();

        res.status(201).json({ message: "Payment data stored successfully" });
    } catch (error) {
        console.error("Error storing Payment data:", error.message);
        res.status(500).json({ error: error.message });
    }
};

const AccountData = async (req, res) => {
    const { fullName, email, PhoneNumber, MaritalStatus, Gender, Address, profileImage } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        user.fullName = fullName;
        user.email = email;
        user.PhoneNumber = PhoneNumber;
        user.MaritalStatus = MaritalStatus;
        user.Gender = Gender;
        user.Address = Address;
        user.profileImage = profileImage;

        await user.save();

        return res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
        console.error("Error updating user data:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const DeleteAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        await User.deleteOne({ email });

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const CancelTrip = async (req, res) => {
    try {
        const { passengerId } = req.params;
        const { route_Id } = req.params;
        const { status } = req.body;

        const passengerData = await PassengerData.findOne({route_Id});

        if (!passengerData) {
            return res.status(404).json({ error: "Passenger not found" });
        }

        const passengerIndex = passengerData.passengers.findIndex(passenger => passenger._id.toString() === passengerId);

        if (passengerIndex === -1) {
            return res.status(404).json({ error: "Passenger not found" });
        }

        passengerData.passengers[passengerIndex].status = status;
        await passengerData.save();

        return res.status(200).json({ message: "Trip canceled successfully" });
    } catch (error) {
        console.error("Error canceling trip:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const TripConfirmation = async (req) => {
    try {
        const { bookingDetails } = req.body;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const emailContent = `<div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; padding: 20px; background-color: #f0f0f0; border-radius: 1rem;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px;">Flight Booking Confirmation</h1>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Dear ${bookingDetails.passengerName},</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">We are pleased to confirm your flight booking with NextBoarding. Below are the details of your upcoming flight:</p>
            <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 5px;"><strong>Flight Number:</strong> ${bookingDetails.flightNumber}</li>
                <li style="margin-bottom: 5px;"><strong>Departure Date:</strong> ${bookingDetails.departureDate.slice(0, 10)}</li>
                <li style="margin-bottom: 5px;"><strong>Departure Time:</strong> ${bookingDetails.departureTime}</li>
                <li style="margin-bottom: 5px;"><strong>Departure Airport:</strong> ${bookingDetails.departureAirport}</li>
                <li style="margin-bottom: 5px;"><strong>Arrival Airport:</strong> ${bookingDetails.arrivalAirport}</li>
                <li style="margin-bottom: 5px;"><strong>Number of Travellers:</strong> ${bookingDetails.numTravelers}</li>
                <li style="margin-bottom: 5px;"><strong>Travel Class:</strong> ${bookingDetails.travelClass}</li>
            </ul>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">If you have any special requests or require assistance, please don't hesitate to contact our customer support team.</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Thank you for choosing NextBoarding for your travel needs.</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                If you need further assistance, feel free to reach out to our support team at <a href="mailto:${process.env.EMAIL_USER}" style="color: #007bff; text-decoration: none;">NextBoarding Team</a>.
            </p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Safe travels,</p>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">NextBoarding Team</p>
        </div>`;

        await transporter.sendMail({
            from: {
                name: "NextBoarding",
                address: process.env.EMAIL_USER,
            },
            to: bookingDetails.EmailAddress,
            subject: "Booking Confirmation",
            html: emailContent,
        });

        return "Email sent successfully.";
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("An error occurred while sending the email.");
    }
};


module.exports = { home, registration, login, user, emailController, OTP, changePassword, storeRouteData, storePassengerData, paymentGateway, AccountData, DeleteAccount, CancelTrip, TripConfirmation };
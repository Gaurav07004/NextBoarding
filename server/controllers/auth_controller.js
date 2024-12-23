const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user_model.js");
const RouteData = require("../models/route_model.js");
const PassengerData = require("../models/passenger_model.js");
const Payment = require("../models/payment_model.js");
const razorpay = require("../middlewares/auth-payment.js");

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

                const route = routeData.find((route) => route._id.toString() === routeId); // Convert route _id to string for comparison

                if (route) {
                    const travelDate = new Date(route.travel_Date);
                    passengerRoute.passengers = passengerRoute.passengers.map((passenger) => {
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

        const { departure_City, departure_Airport, arrival_City, arrival_Airport, travel_Date, traveller_Number, traveller_Class, fare_Type, airline_Name, flight_Number, departure_Time, arrival_Time, total_duration, stop } = req.body;

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
        const route_Id = req.routeIds[req.routeIds.length - 1];
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

        const passengerData = await PassengerData.findOne({ route_Id });

        if (!passengerData) {
            return res.status(404).json({ error: "Passenger not found" });
        }

        const passengerIndex = passengerData.passengers.findIndex((passenger) => passenger._id.toString() === passengerId);

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

        const emailContent = `<div
            style="
                max-width: 600px;
                margin: 0 auto;
                font-family: 'Helvetica Neue', Arial, sans-serif;
                padding: 20px;
                background: url('https://yourcompany.com/background-image.jpg') no-repeat center center / cover;
                border-radius: 1rem;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            "
        >
            <div style="background-color: #fbbf24; padding: 30px; border-radius: 1rem 1rem 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">Flight Booking Confirmation</h1>
            </div>
            <div style="padding: 20px; background-color: rgba(255, 255, 255, 0.95); border-radius: 1rem;">
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 10px;">Dear <strong>${bookingDetails.passengerName}</strong>,</p>
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 10px;">We are excited to confirm your flight booking with <strong>NextBoarding</strong>. Below are the details of your upcoming flight:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f7f7f7;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Flight Number:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.flightNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Departure Date:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.departureDate.slice(0, 10)}</td>
                    </tr>
                    <tr style="background-color: #f7f7f7;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Departure Time:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.departureTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Departure Airport:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.departureAirport}</td>
                    </tr>
                    <tr style="background-color: #f7f7f7;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Arrival Airport:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.arrivalAirport}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Number of Travellers:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.numTravelers}</td>
                    </tr>
                    <tr style="background-color: #f7f7f7;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Travel Class:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${bookingDetails.travelClass}</td>
                    </tr>
                </table>
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 10px;">
                    If you have any special requests or need assistance, please contact our customer support team. We're here to make your journey as smooth as possible.
                </p>
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 10px;">Thank you for choosing <strong>NextBoarding</strong> for your travel needs. We wish you a pleasant trip!</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="mailto:${process.env.EMAIL_USER}" style="background-color: #fbbf24; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 16px;">
                        Contact Support
                    </a>
                </div>
                <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
                    Safe travels,<br />
                    <strong>NextBoarding Team</strong>
                </p>
            </div>
            <div style="background-color: #f0f0f0; padding: 10px; border-radius: 0 0 1rem 1rem; text-align: center; font-size: 12px; color: #777;">
                &copy; ${new Date().getFullYear()} NextBoarding. All rights reserved.
            </div>
        </div>
        `;

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

const PaymentCreateOrder = async (req, res) => {
    const options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: 1,
    };

    try {
        const response = await razorpay.orders.create(options);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

// const PaymentverifyOrder = (req, res) => {
//     const crypto = require('crypto');
//     const generatedSignature = crypto.createHmac('sha256', 'YOUR_KEY_SECRET')
//         .update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`)
//         .digest('hex');

//     if (generatedSignature === req.body.razorpay_signature) {
//         res.json({ success: true });
//     } else {
//         res.status(400).json({ success: false });
//     }
// };

module.exports = { home, registration, login, user, emailController, OTP, changePassword, storeRouteData, PaymentCreateOrder, storePassengerData, paymentGateway, AccountData, DeleteAccount, CancelTrip, TripConfirmation };

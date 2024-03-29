const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
    first_Name: { type: String, required: true },
    middle_Name: { type: String, required: true },
    last_Name: { type: String, required: true },
    email_Address: { type: String, required: true },
    phone_Number: { type: String, required: true },
    gender: { type: String, required: true },
    residential_Address: { type: String, required: true },
});

const emergencyContactSchema = new mongoose.Schema({
    emergency_FirstName: { type: String, required: true },
    emergency_LastName: { type: String, required: true },
    emergency_EmailAddress: { type: String, required: true },
    emergency_PhoneNumber: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passengers: { type: [passengerSchema], required: true },
    emergencyContacts: { type: [emergencyContactSchema], required: true },
    checked_Bags: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

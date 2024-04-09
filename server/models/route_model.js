const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    departure_City: {
        type: String,
        required: true,
    },
    departure_Airport: {
        type: String,
        required: true,
    },
    arrival_City: {
        type: String,
        required: true
    },
    arrival_Airport: {
        type: String,
        required: true
    },
    travel_Date: {
        type: String,
        required: true
    },
    traveller_Number: {
        type: Number,
        required: true
    },
    traveller_Class: {
        type: String,
        required: true
    },
    fare_Type: {
        type: String,
        required: true
    },
    airline_Name: {
        type: String,
        required: true
    },
    flight_Number: {
        type: String,
        required: true
    },
    departure_Time: {
        type: String,
        required: true
    },
    arrival_Time: {
        type: String,
        required: true
    },
    total_duration: {
        type: String,
        required: true
    },
    stop: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Upcoming"
    }
});

const RouteData = mongoose.model('RouteData', routeSchema);

module.exports = RouteData;
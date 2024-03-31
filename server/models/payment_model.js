const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    card_Name: { type: String, required: true },
    card_Number: { type: String, required: true },
    expire_date: { type: String, required: true },
    ccv: { type: String, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;

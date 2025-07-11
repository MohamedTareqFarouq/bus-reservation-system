const mongoose = require("mongoose");
const user = require("./user");
const seat = require("./seat");

const payment = new mongoose.Schema({
    bookingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    trans :{type: str,
        required: true,},
    amount: {
        type: Number,
        required: true,
    },   
})
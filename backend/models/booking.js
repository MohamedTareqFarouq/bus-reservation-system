const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {},
    seatId: {
        type: mongoose.Schema.Types.ObjectId,
    },
     
})
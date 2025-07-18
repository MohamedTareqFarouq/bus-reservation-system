const mongoose = require("mongoose");

const bookingHistory = new mongoose.Schema({
  
   busId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  bookedBy: {
   Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
    name:{
      type: String,
      required: true,
  },
    email:{
      type: String,
      required: true,
  }
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  schedule: {
    type: Date,
    required: true,
  },
  checkInStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  paymentStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  bookingStatus: {
    type: String,
    enum: ["booked", "cancelled", "completed"],
    default: "booked",
  },
  createdAt: { type: Date, default: Date.now },
});

const BookingHistory = mongoose.model("BookingHistory", bookingHistory);
module.exports = BookingHistory;

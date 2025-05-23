const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Bus = require("../models/busForm");
// const Bus = require("../models/busModel");
const Seat = require("../models/seat");
const User = require("../models/user");

/**
 * @typedef {Object} PassengerInfo
 * @property {string} name - Name of the passenger
 * @property {string} route - Seat route/number
 */

/**
 * @route GET /driver-list/seats/:id
 * @description Get list of passengers and their seat assignments for a specific bus
 * @access Public
 * @param {string} req.params.id - Bus ID to check
 * @returns {Object} Object containing passenger list with names and seat routes
 * @property {Array<PassengerInfo>} data.passengerList - Array of passenger details
 * @throws {404} If bus not found
 * @throws {400} If user list is invalid
 * @throws {500} For internal server errors
 */
router.get("/seats/:id", async (req, res) => {
  try {
    const busId = req.params.id;
    // const { userId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const seats = await Seat.find({ busId }, { _id: 1 ,bookedBy:1,route: 1 });
    let userList = seats.map((seat) => seat.bookedBy);
    const seatNoUserId = seats.map((seat)=> seat.route)
    // console.log(userList)
    // console.log(seats)

    if (!Array.isArray(userList)) {
      return res.status(400).json({ message: "userList must be an array" });
    }

    // 2. Get unique user IDs (avoid duplicate fetch)
    const uniqueUserIds = [...new Set(userList)];

    // 3. Fetch users from DB
    const users = await User.find(
      { _id: { $in: uniqueUserIds } },
      { name: 1}
    );

    // 4. Map user ID to user object
    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user._id.toString(), user.name);
    });

    // 5. Reconstruct list to match original order (with duplicates)
    const passengerList = seats.map((seat) => {
    const name = userMap.get(seat.bookedBy.toString()) || "Unknown";
    return {
      name,
      route: seat.route
    };
    });// remove nulls in case of missing users

    return res
      .status(200)
      .json({ message: "Current seats:", data: { passengerList } }); // ✅
  } catch (err) {
    console.error("Error fetching seats:", err);
    res
      .status(500)
      .json({ message: "Error fetching seats", error: err.message });
  }
});

/**
 * @route GET /driver-list/buses
 * @description Get all available buses
 * @access Public
 * @returns {Array<Object>} Array of bus objects
 * @throws {400} For fetch errors
 */
router.get("/buses", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (err) {
    res.status(400).json({ message: "Error fetching busses", error: err });
  }
});

module.exports = router;
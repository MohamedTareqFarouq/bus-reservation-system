const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Bus = require("../models/busForm");
// const Bus = require("../models/busModel");
const Seat = require("../models/seat");
const User = require("../models/user");
const innerAuth = require("../controllers/Inner Authorization");
const { ObjectId } = require("mongodb"); // Import ObjectId from mongodb

router.get("/:id", async (req, res) => {
  try {
    const busId = req.params.id;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const seats = await Seat.find(
      { busId: busId },
      { bookedBy: 1, route: 1, bookedTime: 1, checkInStatus: 1 }
    );
    let userList = seats.map((seat) => seat.bookedBy);
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
      { name: 1, phoneNumber: 1 }
    );

    // 4. Map user ID to user object
    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user._id.toString(), user);
    });

    // 5. Reconstruct list to match original order (with duplicates)
    const orderedUsers = userList.map((id) => userMap.get(id.toString()));

    res
      .status(200)
      .json({ message: "Current seats:", data: { seats, orderedUsers } }); // ✅
  } catch (err) {
    console.error("Error fetching seats:", err);
    res
      .status(500)
      .json({ message: "Error fetching seats", error: err.message });
  }
});

router.post("/user/:id", async (req, res) => {
  try {
    const busId = req.params.id;
    const { userId } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // const seats = await Seat.find({ busId: busId }, { _id: 1 });
    // const userSeats = await Seat.find(
    //   { busId: busId, bookedBy: userId },
    //   { _id: 1, route: 1 }
    // );
    // const finalSeatsArr = seats.map((seatId) => ({
    //   seatId: seatId._id.toString(),
    //   currentUser:
    //     userSeats.filter(
    //       (userSeat) => userSeat._id.toString() === seatId._id.toString()
    //     ).length > 0,

    //   route:
    //     userSeats.find(
    //       (userSeat) => userSeat._id.toString() === seatId._id.toString()
    //     )?.route || undefined,
    // }));

    /////////

    const seats = await Seat.find({ busId }, { _id: 1 });
    const userSeats = await Seat.find(
      { busId, bookedBy: userId },
      { _id: 1, route: 1 }
    );

    // Create a Map for faster lookup
    const userSeatMap = new Map(
      userSeats.map((seat) => [seat._id.toString(), seat.route])
    );

    const finalSeatsArr = seats.map((seat) => {
      const idStr = seat._id.toString();
      return {
        seatId: idStr,
        currentUser: userSeatMap.has(idStr),
        route: userSeatMap.get(idStr) || undefined,
      };
    });

    ////////

    // let userList = seats.map(seat => seat.bookedBy);
    // console.log(userList)
    // console.log(seats)
    // let userSeat = [];
    // for (let i = 0; i < seats.length ; i++ ){
    //     if (seats[i].bookedBy == userId){
    //         userSeat.push([i+1,seats[i].route]);
    //     }
    // }
    // seatsIds = seats.map(seat => seat._id)
    return res
      .status(200)
      .json({ message: "Current seats:", data: { finalSeatsArr } }); // ✅
  } catch (err) {
    console.error("Error fetching seats:", err);
    res
      .status(500)
      .json({ message: "Error fetching seats", error: err.message });
  }
});


router.put("/check-in/:seatId", async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.seatId);
      if (!seat) return res.status(404).json({ error: "seat not found" });
  
      seat.checkInStatus = true; // Mark user as checked in
      await seat.save();
  
      res.json({ message: "seat checked in successfully", seat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  

router.put("/check-out/:seatId", async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.seatId);
      if (!seat) return res.status(404).json({ error: "seat not found" });
  
      seat.checkInStatus = false; // Mark user as checked in
      await seat.save();
  
      res.json({ message: "seat checked in successfully", seat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
  

module.exports = router;

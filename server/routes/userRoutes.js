const express = require("express");
const User = require("../models/user");
const router = express.Router();
const Bus = require("../models/busModel");
const middleware = require("../controllers/middleware");
const { default: mongoose } = require("mongoose");
const { route } = require("./busRoutes");

// Add new User details
// router.post("/bus", async (req, res) => {
//     try {
//         const { name, email, password, bookedBuses } = req.body;

//         console.log(req.body);

//         // Check if all required fields are provided
//         // !name || !email || !password ||
//         if (!bookedBuses) {
//             return res.status(400).json({
//                 message: "Missing required fields",
//             });
//         }

//         // console.log('Name:', name);
//         // console.log('Email:', email);
//         // console.log('Password:', password);

//         const newUser = new User({
//             name: name,
//             email: email,
//             password: password,
//             bookedBuses: {
//                 BusId: bookedBuses.BusId,
//                 SeatsNumbers: bookedBuses.SeatsNumbers
//             }
//         });

//         const user = await newUser.save();
//         res.status(201).json(user);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })

// Get all Users
router.get("/", middleware.isAuthoraized, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Specific User
router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post("/profiles", async (req, res) => {
  const { userIds } = req.body;
  const users = await User.find({ _id: { $in: userIds } }, "name phoneNumber bookedBuses.seats checkInStatus bookedTime"); // Fetch all users at once
  res.json(users);
});

router.post("/profilesNames", async (req, res) => {
  const { userIds } = req.body;
  const users = await User.find({ _id: { $in: userIds } }, "name"); // Fetch all users at once
  res.json(users);
});


// get a specific bus
router.get("/bus/:id", async (req, res) => {
  try {
    const users = await User.find({ _id: req.params.id });
    // res.json(users);
    // res.json(users.map(user => user.bookedBuses.BusId));
    const busIds = users.map((user) => user.bookedBuses.BusId);
    // const objIds = [busIds.map(id => new mongoose.Types.ObjectId(id))];
    const avBuses = await Bus.find({ _id: { $in: busIds } });
    res.json(avBuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/bus/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/check-in/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.checkInStatus = true; // Mark user as checked in
    await user.save();

    res.json({ message: "User checked in successfully", user });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/check-out/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.checkInStatus = false; // Mark user as checked in
    await user.save();

    res.json({ message: "User checked in successfully", user });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/edit-gender/:userId", async (req, res) => {
  try {
    const { gender } = req.body; // ✅ Extract gender
    console.log(gender)

    if (!gender) return res.status(400).json({ error: "Gender is required" });

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.gender = gender; // ✅ Assign the correct value
    await user.save();

    res.json({ message: "Gender updated successfully", user });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;

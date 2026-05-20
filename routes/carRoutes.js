const router = require("express").Router();
const Car = require("../models/Car");
const jwt = require("jsonwebtoken");

// ➕ CREATE CAR
router.post("/cars", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const car = await Car.create({
      ...req.body,
      userId: decoded.id, // Saved using the logged-in user's ID from token
    });

    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 GET ALL (EXPLORE PAGE)
router.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 GET MY CARS (SECURE FIX)
// Changed route from "/cars/user/:id" to "/cars/my-cars" for token-based tracking
router.get("/cars/my-cars", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Decoding token to get the logged-in user's ID safely
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Finding cars that belong strictly to this userId
    const cars = await Car.find({ userId: decoded.id });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 SINGLE CAR
router.get("/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 ✅ UPDATE CAR 
router.put("/cars/:id", async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑 DELETE CAR
router.delete("/cars/:id", async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
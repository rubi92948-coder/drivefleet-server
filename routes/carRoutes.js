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
      userId: decoded.id,
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


// 📥 GET MY CARS (IMPORTANT FIX)
router.get("/cars/user/:id", async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.params.id });
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
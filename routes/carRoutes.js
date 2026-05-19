const express = require("express");
const router = express.Router();
const Car = require("../models/Car");


// ➤ CREATE CAR
router.post("/cars", async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ➤ GET ALL CARS
router.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ➤ GET SINGLE CAR
router.get("/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ➤ UPDATE CAR
router.put("/cars/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ➤ DELETE CAR
router.delete("/cars/:id", async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
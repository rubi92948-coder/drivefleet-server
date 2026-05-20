const router = require("express").Router();
const Car = require("../models/Car");
const jwt = require("jsonwebtoken");

// ➕ CREATE CAR (JWT PROTECTED)
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

// 📥 GET ALL
router.get("/cars", async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

// 🔍 GET SINGLE
router.get("/cars/:id", async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.json(car);
});

// ✏️ UPDATE
router.put("/cars/:id", async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(car);
});

// 🗑 DELETE
router.delete("/cars/:id", async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
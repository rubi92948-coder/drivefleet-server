import express from "express";
import Car from "../models/Car.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ---------------- CREATE CAR (PROTECTED) ---------------- */
router.post("/", async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
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

/* ---------------- GET ALL CARS (PUBLIC) ---------------- */
router.get("/", async (req, res) => {
  try {
    const { search, type } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (type && type !== "All") {
      const typeArray = type.split(",");
      query.type = { $in: typeArray };
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- MY CARS (PROTECTED) ---------------- */
router.get("/my-cars", async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const cars = await Car.find({ userId: decoded.id });

    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- SINGLE CAR ---------------- */
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- UPDATE CAR ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE CAR ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
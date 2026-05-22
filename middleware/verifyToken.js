import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// protected route
router.get("/", verifyToken, async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
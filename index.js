import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { auth } from "./lib/auth.js";
import carRoutes from "./routes/carRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Car from "./models/Car.js";

const app = express();

/* ---------------- DB CONNECTION ---------------- */
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected ✅");
    }
  } catch (err) {
    console.error("DB Connection Error:", err.message);
  }
};
connectDB();

/* ---------------- PARSERS ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- FINAL CORS FIX ---------------- */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

/* ---------------- ROUTES ---------------- */
app.all("/api/auth/*", (req, res) => {
  return auth.handler(req, res);
});

app.use("/api/cars", carRoutes);
app.use("/api/user", userRoutes);

app.put("/api/cars/book/:id", async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { $inc: { bookingCount: 1 } },
      { new: true }
    );
    res.json(updatedCar || { message: "Car not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("🚗 DriveFleet API Running Successfully");
});

export default app;
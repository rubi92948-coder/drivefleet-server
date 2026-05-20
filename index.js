const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const Car = require("./models/Car"); 

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api", carRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// 1. Booking Confirmation (Increase Count)
app.put("/api/cars/book/:id", async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { $inc: { bookingCount: 1 } },
      { new: true }
    );
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: "Failed to update count" });
  }
});

// 2. Booking Cancellation (Decrease Count)
app.put("/api/cars/cancel-booking/:id", async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { $inc: { bookingCount: -1 } },
      { new: true }
    );
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: "Failed to update count" });
  }
});

app.get("/", (req, res) => { res.send("DriveFleet API Running 🚗"); });

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
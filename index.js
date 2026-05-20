const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();


// =====================
// MIDDLEWARE
// =====================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


// =====================
// ROUTES
// =====================
app.use("/api", carRoutes);
app.use("/api/auth", authRoutes);


// =====================
// HOME ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("DriveFleet API Running 🚗");
});


// =====================
// MONGODB CONNECT
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error ❌", err));


// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
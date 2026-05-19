const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const carRoutes = require("./routes/carRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", carRoutes);

app.get("/", (req, res) => {
  res.send("DriveFleet API Running 🚗");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error ❌", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
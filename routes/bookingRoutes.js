const express = require("express");
const router = express.Router();
const Car = require("../models/Car"); 
router.post("/save-booking", async (req, res) => {
  try {
    const { carId } = req.body; 

    
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { $inc: { bookingCount: 1 } },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    
    res.status(200).json({ message: "Booking confirmed!", updatedCar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
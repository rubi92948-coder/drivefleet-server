const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// GET PROFILE
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PROFILE (NEW ROUTE)
router.put("/update", async (req, res) => {
  try {
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get name and email from request body
    const { name, email } = req.body;

    // Find user and update their info, returning the updated user document
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the updated user data back to frontend
    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
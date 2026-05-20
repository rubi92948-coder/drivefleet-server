const router = require("express").Router();
const jwt = require("jsonwebtoken");

// LOGIN (example)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // demo user check (replace DB later)
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const token = jwt.sign(
    { id: "12345", email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ message: "Login successful", token });
});

module.exports = router;
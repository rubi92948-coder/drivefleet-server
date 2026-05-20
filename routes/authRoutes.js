const router = require("express").Router();
const jwt = require("jsonwebtoken");

// LOGIN (example)
router.get("/me", (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
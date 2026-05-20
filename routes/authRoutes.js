const router = require("express").Router();
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // basic validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Invalid data",
    });
  }

  // demo user id (later DB use korba)
  const userId = "12345";

  // create token
  const token = jwt.sign(
    {
      id: userId,
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // cookie set
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  // response FIXED (frontend use korte parbe)
  res.json({
    message: "Login successful",
    token,
    user: {
      id: userId,
      email: email,
    },
  });
});

module.exports = router;
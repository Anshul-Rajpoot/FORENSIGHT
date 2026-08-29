const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const requestedRole = String(req.body.role || "NORMAL").toUpperCase();
    const adminSecret = String(req.body.adminSecret || "");

    if (!name || !email || !password) {
      if (req.accepts("html")) return res.redirect("/signup?error=Missing%20required%20fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    let role = "NORMAL";
    if (requestedRole === "ADMIN") {
      if (!process.env.ADMIN_SECRET_KEY || adminSecret !== process.env.ADMIN_SECRET_KEY) {
        if (req.accepts("html")) return res.redirect("/signup?error=Invalid%20admin%20secret");
        return res.status(403).json({ message: "Invalid admin secret" });
      }
      role = "ADMIN";
    }

    const existing = await User.findOne({ email });
    if (existing) {
      if (req.accepts("html")) return res.redirect("/signup?error=User%20already%20exists");
      return res.status(409).json({ message: "User exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash, role });

    if (req.accepts("html")) return res.redirect("/login?created=1");
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      if (req.accepts("html")) return res.redirect("/login?error=Missing%20email%20or%20password");
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      if (req.accepts("html")) return res.redirect("/login?error=Invalid%20credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (req.accepts("html")) return res.redirect("/");
    res.json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Logout failed");
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = { router };

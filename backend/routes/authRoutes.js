
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// STUDENT REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { name, studentId, email, password } = req.body;

    // CHECK REQUIRED FIELDS
    if (
      !name?.trim() ||
      !studentId?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all fields.",
      });
    }

    // VALIDATE PASSWORD
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedStudentId = studentId.trim();

    // CHECK EXISTING EMAIL OR STUDENT ID
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { studentId: normalizedStudentId },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? "Email is already registered."
            : "Student ID is already registered.",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE STUDENT ACCOUNT
    const newUser = new User({
      name: name.trim(),
      studentId: normalizedStudentId,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Student account created successfully.",
    });

  } catch (error) {
    console.error("STUDENT REGISTRATION ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or Student ID is already registered.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
});


// USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

res.json({
  success: true,
  message: "Login successful.",
  token,
  user: {
    id: user._id,
    name: user.name,
    studentId: user.studentId,
    email: user.email,
    role: user.role,
  },
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
});

module.exports = router;

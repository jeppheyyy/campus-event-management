
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// STUDENT REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { name, studentId, email, password } = req.body || {};

    // CHECK REQUIRED FIELDS AND DATA TYPES
    if (
      typeof name !== "string" ||
      typeof studentId !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !studentId.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all fields correctly.",
      });
    }

    const normalizedName = name.trim();
    const normalizedStudentId = studentId.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // VALIDATE FIELD LENGTHS
    if (normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must not exceed 100 characters.",
      });
    }

    if (normalizedStudentId.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Student ID must not exceed 50 characters.",
      });
    }

    if (normalizedEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Email must not exceed 254 characters.",
      });
    }

    // VALIDATE EMAIL FORMAT
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // VALIDATE PASSWORD
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // BCRYPT SUPPORTS PASSWORDS UP TO 72 UTF-8 BYTES
    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 72 bytes.",
      });
    }

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
      name: normalizedName,
      studentId: normalizedStudentId,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();

    return res.status(201).json({
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

    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
});

// USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // CHECK REQUIRED FIELDS
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // CHECK EMAIL LENGTH AND FORMAT
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      normalizedEmail.length > 254 ||
      !emailPattern.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // FIND USER
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // CHECK PASSWORD
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

    // CHECK JWT CONFIGURATION
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from backend configuration.");

      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
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
    console.error("USER LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

module.exports = router;

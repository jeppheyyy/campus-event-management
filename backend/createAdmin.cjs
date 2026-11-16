
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@campus.com";
    const password = "Admin123!";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "System Administrator",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();

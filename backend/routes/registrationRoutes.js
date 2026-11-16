
const express = require("express");
const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER FOR AN EVENT
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can register for events.",
      });
    }

    const { eventId } = req.body;

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid event ID.",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (event.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This event is not open for registration.",
      });
    }

    const existingRegistration = await Registration.findOne({
      student: req.user.id,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event.",
      });
    }

    const registration = new Registration({
      student: req.user.id,
      event: eventId,
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: "Event registration successful!",
      registration,
    });
  } catch (error) {
    console.error("REGISTER EVENT ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register for event.",
    });
  }
});

// GET LOGGED-IN STUDENT'S REGISTRATIONS
router.get("/my", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student account required.",
      });
    }

    const registrations = await Registration.find({
      student: req.user.id,
    })
      .populate("event")
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      registrations,
    });
  } catch (error) {
    console.error("GET REGISTRATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve registrations.",
    });
  }
});

// CANCEL REGISTRATION
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student account required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID.",
      });
    }

    const registration = await Registration.findOneAndDelete({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }

    res.json({
      success: true,
      message: "Registration cancelled successfully.",
    });
  } catch (error) {
    console.error("CANCEL REGISTRATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel registration.",
    });
  }
});

module.exports = router;

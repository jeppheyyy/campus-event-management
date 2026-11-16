
const express = require("express");
const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET STUDENTS REGISTERED FOR AN EVENT
router.get("/events/:eventId", protect, adminOnly, async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const registrations = await Registration.find({
      event: eventId,
    })
      .populate("student", "name email")
      .sort({ registeredAt: 1 });

    res.json({
      success: true,
      event,
      registrations,
    });
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance records.",
    });
  }
});

// UPDATE STUDENT ATTENDANCE
router.patch("/:registrationId", protect, adminOnly, async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { attendanceStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID.",
      });
    }

    if (!["Present", "Absent", "Not Marked"].includes(attendanceStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status.",
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      registrationId,
      { attendanceStatus },
      { new: true, runValidators: true }
    ).populate("student", "name email");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration record not found.",
      });
    }

    res.json({
      success: true,
      message: "Attendance updated successfully.",
      registration,
    });
  } catch (error) {
    console.error("UPDATE ATTENDANCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update attendance.",
    });
  }
});

module.exports = router;

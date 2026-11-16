
const express = require("express");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve events.",
    });
  }
});

// GET ONE EVENT
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID.",
    });
  }
});

// CREATE EVENT (ADMIN ONLY)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, category, date, time, location, description } = req.body;

    if (!title || !category || !date || !time || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Please complete all event fields.",
      });
    }

    const newEvent = new Event({
      title,
      category,
      date,
      time,
      location,
      description,
      createdBy: req.user.id,
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event: savedEvent,
    });
} catch (error) {
  console.error("CREATE EVENT ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});

// UPDATE EVENT (ADMIN ONLY)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.json({
      success: true,
      message: "Event updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update event.",
    });
  }
});

// DELETE EVENT (ADMIN ONLY)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
});

module.exports = router;

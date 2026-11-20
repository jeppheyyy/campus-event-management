const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const express = require("express");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();
const validateEventData = (data) => {
  const { title, category, date, time, location, description } = data;

  if (
    !title?.trim() ||
    !category?.trim() ||
    !date ||
    !time?.trim() ||
    !location?.trim() ||
    !description?.trim()
  ) {
    return "Please complete all event fields.";
  }

  if (isNaN(Date.parse(date))) {
    return "Please enter a valid event date.";
  }

  return null;
};

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

const validationError = validateEventData(req.body);

if (validationError) {
  return res.status(400).json({
    success: false,
    message: validationError,
  });
}

    const newEvent = new Event({
      title: title.trim(),
      category: category.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const validationError = validateEventData(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { title, category, date, time, location, description } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        category: category.trim(),
        date,
        time: time.trim(),
        location: location.trim(),
        description: description.trim(),
      },
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
    console.error("UPDATE EVENT ERROR:", error);

    res.status(400).json({
      success: false,
      message: "Failed to update event.",
    });
  }
});

// DELETE EVENT (ADMIN ONLY)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Delete registrations connected to this event
    await Registration.deleteMany({ event: event._id });

    // Delete the event
    await event.deleteOne();

    res.json({
      success: true,
      message: "Event and its associated registrations deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
});
module.exports = router;

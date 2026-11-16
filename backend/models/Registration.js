
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    attendanceStatus: {
      type: String,
      enum: ["Not Marked", "Present", "Absent"],
      default: "Not Marked",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from registering for an event twice.
registrationSchema.index(
  { student: 1, event: 1 },
  { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema);

const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    doctorInfo: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    videoId: {
      type: String,
      default: "videoId will be available at appointment date and time when doctor starts the video call",
    },
    isVideoEnded: {
      type: Boolean,
      default: false,
    },
    Prescription: {
      type: String,
      default: "Availabble after video consultation",
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("appointmenst", appointmentSchema);
module.exports = appointmentModel;

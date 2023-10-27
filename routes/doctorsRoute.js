const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const moment = require("moment");

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dicrko3r2',
  api_key: '343791644752978',
  api_secret: 'Shoyrv1UOoVVVg6kJ5qf50PCi_I'
});

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const file = req.files.photo;
    console.log('file is ', file);

    // Upload photo to Cloudinary
    cloudinary.uploader.upload(file.tempFilePath, async (uploadErr, result) => {
      if (uploadErr) {
        console.error('Error uploading file to Cloudinary:', uploadErr);
        return res.status(500).json({
          message: "Error uploading photo to Cloudinary",
          success: false,
          error: uploadErr,
        });
      }

      console.log('result is ', result);
      console.log('URL is ', result.url);

      // Update doctor profile with new data including the photo URL
      const updatedDoctor = await Doctor.findOneAndUpdate(
        { userId: req.body.userId },
        { ...req.body, photo: result.url },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Doctor profile updated successfully",
        data: updatedDoctor,
        photoUrl: result.url, // Optionally send the Cloudinary URL in the response.
      });
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({
      message: "Error updating doctor profile",
      success: false,
      error,
    });
  }
});

router.get(
  "/get-appointment-by-appointment-id",
  authMiddleware,
  async (req, res) => {
    try {
      const { appointmentId } = req.query; // Use req.query to get query parameters
      const appointment = await Appointment.findOne({ _id: appointmentId });

      if (!appointment) {
        return res.status(404).send({
          message: "Appointment not found",
          success: false,
        });
      }

      res.status(200).send({
        message: "Appointment fetched successfully",
        success: true,
        data: appointment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error fetching appointment",
        success: false,
        error: error.message,
      });
    }
  }
);


router.get(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await Appointment.find({ doctorId: doctor._id });
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error,
      });
    }
  }
);

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    //console.log(req.body);
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment status updated successfully",
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    });
  }
});

router.post("/store-video-id", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, videoId } = req.body;

    // Find the appointment by ID and update the videoId
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { videoId },
      { new: true }
    );

    //console.log(appointment);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Fetch user information for sending notifications
    const user = await User.findOne({ _id: appointment.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Push a notification to the user
    const message = `The videoId is ${videoId} for Appointment ID: ${appointmentId}`;
    const notification = {
      type: "videoId-stored",
      message,
      onClickPath: "/appointments",
    };

    // Push the notification to the user's unseen notifications
    user.unseenNotifications.push(notification);

    // Save the user with the new notification
    await user.save();

    res.status(200).json({
      message: "Video ID stored successfully",
      success: true,
      appointment,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error storing Video ID",
      success: false,
      error,
    });
  }
});

// New route to set isVideoEnded to true
router.post("/end-video", authMiddleware, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Find the appointment by ID and update isVideoEnded to true
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { isVideoEnded: true },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Fetch user information for sending notifications
    const user = await User.findOne({ _id: appointment.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Push a notification to the user
    const message = `The video consultation with Dr. ${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName} has ended. A prescription will be sent soon.`;
    const notification = {
      type: "video-ended",
      message,
      onClickPath: "/appointments",
    };

    // Push the notification to the user's unseen notifications
    user.unseenNotifications.push(notification);

    // Save the user with the new notification
    await user.save();

    // Send a push notification (you need to implement this function)
    // sendNotification(user.deviceToken, message);

    res.status(200).json({
      message: "Video has ended for the appointment",
      success: true,
      appointment,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error ending the video",
      success: false,
      error,
    });
  }
});




router.post('/store-prescription', authMiddleware, async (req, res) => {
  try {
    const { appointmentId, prescription } = req.body;


    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { prescription },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Fetch user information for sending notifications
    const user = await User.findOne({ _id: appointment.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a notification to the user
    const notification = {
      type: 'prescription-sent',
      message: 'Your prescription is ready. Click here to view.',
      onClickPath: `/appointments/${appointmentId}`,
    };

    // Push the notification to the user's unseen notifications
    user.unseenNotifications.push(notification);

    // Save the user with the new notification
    await user.save();

    res.status(200).json({
      message: 'Prescription stored successfully',
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: 'Error storing prescription',
      success: false,
      error,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");

const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dicrko3r2',
  api_key: '343791644752978',
  api_secret: 'Shoyrv1UOoVVVg6kJ5qf50PCi_I'
});
//const files = fileUpload;

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET
        , { expiresIn: "1d", }
      );
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

router.post("/apply-doctor-account", async (req, res) => {
  try {
    console.log('request body:', req.body);
    const file = req.files.photo;
    console.log('file is ', file);

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

      const newdoctor = new Doctor({ ...req.body, status: "pending", photo: result.url });
      await newdoctor.save();
      const adminUser = await User.findOne({ isAdmin: true });

      const unseenNotifications = adminUser.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request",
        message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
        data: {
          doctorId: newdoctor._id,
          name: newdoctor.firstName + " " + newdoctor.lastName,
        },
        onClickPath: "/admin/doctorslist",
      });
      await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });

      res.status(200).json({
        success: true,
        message: "Doctor account applied successfully",
        photoUrl: result.url, // Optionally send the Cloudinary URL in the response.
      });
    });
  } catch (error) {
    console.error('Error in applying doctor account:', error);
    res.status(500).json({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    //pushing notification to doctor based on his userid
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
  try {


    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const selectedDate = moment(req.body.date, "DD-MM-YYYY");
    const selectedTime = moment(req.body.time, "HH:mm");
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const timeSlot1 = moment(req.body.timeSlot1, "HH:mm");
    const timeSlot2 = moment(req.body.timeSlot2, "HH:mm");


    console.log('time:', selectedTime);
    console.log('fromTime:', fromTime);
    console.log('date:', date);
    console.log("timings:", timeSlot1, " - ", timeSlot2);


    // Check if the selected date is in the past
    if (selectedDate.isBefore(moment(), "day")) {
      return res.status(200).send({
        message: "Selected date is in the past",
        success: false,
      });
    }

    // Check if the selected time is within the specified time slot
    console.log("isWithinTimeSlot:", selectedTime.isBetween(timeSlot1, timeSlot2, null, "[]"));
    if (!selectedTime.isBetween(timeSlot1, timeSlot2, null, "[]")) {
      return res.status(200).send({
        message: "Selected time is not within the specified time slot",
        success: false,
      });
    }


    const overlappingAppointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
      //sstatus: 'approved'
    });



    if (overlappingAppointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    }
    else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });

    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
    console.log('appointment', appointments);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
});
module.exports = router;

const express = require('express');
const { loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorsController, bookAppointmentController, bookingAvailabilityController, UserAppointmentController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//router object
const router = express.Router();

//routes
//LOGIN || POST
router.post('/login', loginController);

//REGISTER || POST
router.post('/register', registerController);

//AUTH || POST
router.post('/getUserData', authMiddleware, authController);

//Apply Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController);

//Notification Doctor || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController);


//Notification Doctor || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController);

//GET ALL DOCTORS || GET
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// BOOK appointments
router.post('/book-appointment', authMiddleware, bookAppointmentController);

// BOOKING Availability
router.post('/booking-availability', authMiddleware, bookingAvailabilityController);

//APPOIMENTS LIST
router.get('/user-appointments', authMiddleware, UserAppointmentController);
module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController } = require('../controllers/doctorCtrl')
//POST SINGLE DOC INFO
router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController)

// POST UPDATE PROFILE
router.post('/updateProfile', authMiddleware, updateProfileController)

//POST GET SINGLE DOC INFO
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)

//GET APPOINTMENTS
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController)
module.exports = router;
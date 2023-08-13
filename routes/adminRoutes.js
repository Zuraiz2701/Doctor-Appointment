const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminCtrl');

// GET Method || USERS

router.get('/getAllUsers', authMiddleware, getAllUsersController);

// GET Method || DOCTORS
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

//POST Method || DOCTORS
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)
module.exports = router;
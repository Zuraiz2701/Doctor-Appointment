const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');

//register callback
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ success: false, message: 'User already exists' });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
    }
};

// login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ success: false, message: 'User does not exists' });
        }
        const password = req.body.password;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).send({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ success: true, message: 'User logged in successfully', token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
};

const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: 'User not found',
                success: false,
            });
        }
        else {
            res.status(200).send({
                message: 'User found',
                success: true,
                data: user,
                //{
                //    name: user.name,
                //    email: user.email,
                //    isAdmin: user.isAdmin,
                //    isDoctor: user.isDoctor,
                //    _id: user._id,
                //    notification: user.notification,
                //    ScreenOrientation: user.ScreenOrientation,
                //}
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Auth Error",
            success: false,
            error
        });
    }
}

// user can apply as poctor
const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied as doctor`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onclickPath: "/admin/doctors"
            }
        });
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: `Doctor applied successfully`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: `Error while applying doctor`
        })
    }
}

// notification controller
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const notification = user.notification;
        const seenNotification = user.seennotification;
        seenNotification.push(...notification);
        user.notification = [];
        user.seennotification = notification;
        const updatedUser = await user.save();
        res.status(200).send({
            success: true,
            message: "all notification marked as read",
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while getting notification",
            success: false,
            error,
        })
    }
}

// delete notifications
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seennotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "all notification deleted",
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while getting notification",
            success: false,
            error,
        })
    }
}

//Get All Doctors
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' });
        res.status(200).send({
            success: true,
            message: "All Doctors",
            data: doctors
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while getting notification",
            success: false,
            error,
        })
    }
}

const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        req.body.time = moment(req.body.time, 'HH:mm').toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: "New-appointment-request",
            message: `You have a new appointment request from ${req.body.userInfo.name}`,
            onclickPath: "/user/appointments"
        })
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment booked successfully",
            //data: newAppointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while booking appointment",
            success: false,
            error,
        })
    }
}

const bookingAvailabilityController = async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime, $lte: toTime
            }
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                success: true,
                message: "Appointment not available",
                //data: appointments
            });
        }
        else {
            return res.status(200).send({
                success: true,
                message: "Appointment available",
                //data: appointments
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error while booking appointment",
            success: false,
            error,
        })
    }
}

const UserAppointmentController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const appointments = await appointmentModel.find({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: "All Appointments",
            data: appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in getting appointments",
            success: false,
            error,
        })
    }
}
module.exports = {
    loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    bookingAvailabilityController,
    UserAppointmentController
};
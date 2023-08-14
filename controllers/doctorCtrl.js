const doctorModel = require('../models/doctorModel');
const appointmentModel = require("../models/appointmentModel");
const userModel = require('../models/userModels');
const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });

        return res.status(200).send({
            success: true,
            message: 'doctor data fetched successfully',
            data: doctor,
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'internal server error',
            error,
        });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        return res.status(200).send({
            success: true,
            message: 'doctor profile updated successfully',
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'doctor profile update failed',
            error,
        }
        );
    }
}

const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        return res.status(200).send({
            success: true,
            message: 'Single Doctor Info',
            data: doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Single Doctor Info',
            error,
        })
    }
}

const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({ doctorId: doctor._id });
        return res.status(200).send({
            success: true,
            message: 'Doctor Appointments fetched successfully',
            data: appointments,
        })
    } catch (error) {
        console
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Doctor Appointments',
            error,
        })
    }
}

const updateStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        const appointments = await appointmentModel.findOneAndUpdate(req.body._id, { status });
        const user = await userModel.findOne({ _id: appointments.userId });
        const notification = user.notification;
        notification.push({
            type: "status-updated",
            message: `Your appointment has been updated ${status}`,
            onclickPath: "/doctor-appointments"
        })
        await user.save();
        return res.status(200).send({
            success: true,
            message: 'Appointment status Updated Successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Status',
            error,
        }
        );

    }
}
module.exports = {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    doctorAppointmentsController,
    updateStatusController
}
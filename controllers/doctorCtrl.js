const doctorModel = require('../models/doctorModel');
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
module.exports = { getDoctorInfoController, updateProfileController }
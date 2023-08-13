const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'Please enter your address'],
    },
    specialization: {
        type: String,
        required: [true, 'Please enter your specialization'],
    },
    experience: {
        type: String,
        required: [true, 'Please enter your experience'],
    },
    feePerMinute: {
        type: Number,
        required: [true, 'Please enter your fee per minute'],
    },
    status: {
        type: String,
        default: 'pending',
    },
    timings: {
        type: Object,
        required: [true, 'Please enter your available time slots'],
    },

}, { timestamps: true });

const doctorModel = mongoose.model('doctors', doctorSchema);
module.exports = doctorModel;
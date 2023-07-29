const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

module.exports = { loginController, registerController };
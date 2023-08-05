const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/user', require('./routes/userRoutes'));

//port
const port = process.env.PORT || 8080;
const mode = process.env.NODE_MODE || "development";

//listen port
app.listen(port, () => {
    console.log(`Server is running on port ${mode} Mode on port ${port}`.bgCyan.white);
});
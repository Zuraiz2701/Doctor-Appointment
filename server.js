const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');

//dotenv config
dotenv.config();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//routes
app.get("/", (req, res) => {
    res.status(200).send({
        message: "server is running",
    });
});

//port
const port = process.env.PORT || 8080;
const mode = process.env.NODE_MODE || "development";

//listen port
app.listen(port, () => {
    console.log(`Server is running on port ${mode} Mode on port ${port}`.bgCyan.white);
});
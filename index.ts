const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/apiRoutes");

import connectDB from "./config/db.config";

/**
 * -------------- GENERAL SETUP ----------------
 */

require("dotenv").config();

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(cors());

// Parsers
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * -------------- ROUTES ----------------
 */

app.use("/api", apiRoutes);

/**
 * -------------- ERRORS ----------------
 */

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

/**
 * -------------- SERVER ----------------
 */

const PORT = process.env.PORT || 3001;

app.disable("x-powered-by"); // Disabling Powered by tag

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode, under port ${PORT}.`);
});

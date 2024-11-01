import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import bodyParser from "body-parser";
import apiRoutes from "./routes/apiRoutes";
import { connectDB } from "./config/db.config";
import { CustomErrorType } from "./interfaces/appInterface";
import multer, { FileFilterCallback } from "multer";
import path from "path";

/**
 * -------------- GENERAL SETUP ----------------
 */

require("dotenv").config();

connectDB();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "..", "images")));

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
 * -------------- LOGS ----------------
 */

require("./config/log")();

/**
 * -------------- ERRORS ----------------
 */

app.use((error: CustomErrorType, req: Request, res: Response, next: NextFunction) => {
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

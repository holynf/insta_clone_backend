import User from "../models/user";
import { validationResult } from "express-validator";

import { CustomErrorType } from "../interfaces/appInterface";
import { User as UserModel } from "../interfaces/models/user";
import { NextFunction, Request, Response } from "express";
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");

exports.register = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error: CustomErrorType = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const username = req.body.username;

    bcrypt
        .hash(password, 12)
        .then((hashedPw: string) => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name,
                username: username,
            });
            return user.save();
        })
        .then((result: UserModel) => {
            res.status(201).json({ message: "User created!", userId: result._id });
        })
        .catch((err: CustomErrorType) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        const error: CustomErrorType = new Error("Please provide Email or Password!");
        error.statusCode = 404;
        throw error;
    }

    let loadedUser: UserModel;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const error: CustomErrorType = new Error(
                    "A user with this email could not be found.",
                );
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error: CustomErrorType = new Error("Wrong password!");
                error.statusCode = 401;
                throw error;
            }
            const token: string = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" },
            );
            res.status(200).json({ token: token, userId: loadedUser._id.toString() });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

import User from "../models/user";
import { validationResult } from "express-validator";

import { CustomErrorType } from "../interfaces/appInterface";
import { UserModelType } from "../interfaces/models/user";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ErrorValidationResult from "../utils/ErrorValidationResult";

export const register = (req: Request, res: Response, next: NextFunction) => {
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
        .then((result: UserModelType) => {
            res.status(201).json({ message: "User created!", userId: result._id });
        })
        .catch((err: CustomErrorType) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return ErrorValidationResult({
            code: 404,
            errorBody: "Please provide Email or Password!",
        });
    }

    let loadedUser: UserModelType;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return ErrorValidationResult({
                    code: 401,
                    errorBody: "A user with this email could not be found.",
                });
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                return ErrorValidationResult({
                    code: 401,
                    errorBody: "Wrong password!",
                });
            }
            const token: string = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                process.env.JWT_SECRET as string,
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

const controller = {
    login,
    register,
};
export default controller;

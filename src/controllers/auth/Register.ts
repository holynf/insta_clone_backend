import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CustomErrorType } from "../../interfaces/appInterface";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import { UserModelType } from "../../interfaces/models/user";

export const AuthRegister = (req: Request, res: Response, next: NextFunction) => {
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

export default AuthRegister;

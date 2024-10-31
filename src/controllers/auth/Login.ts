import { NextFunction, Request, Response } from "express";
import ErrorValidationResult from "../../utils/ErrorValidationResult";
import { UserModelType } from "../../interfaces/models/user";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const AuthLogin = (req: Request, res: Response, next: NextFunction) => {
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

export default AuthLogin;

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import User from "../models/user";
import { CustomErrorType } from "../interfaces/appInterface";
import ErrorValidationResult from "../utils/ErrorValidationResult";

const authSchema = z.object({
    authorization: z.string().min(1, "Authorization header is required"),
});

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = authSchema.parse(req.headers);

        const token = authorization.replace("Bearer ", "");

        jwt.verify(token, process.env.JWT_SECRET!, async (err, payload) => {
            if (err || !payload) {
                return res.status(401).json({
                    code: 401,
                    errorBody: "Your session has expired.",
                });
            }

            const { userId } = payload as JwtPayload;

            const userdata = await User.findById(userId);

            if (!userdata) {
                const error: CustomErrorType = new Error("User not found.");
                (error as any).statusCode = 404;
                return next(error);
            }

            req.user = userdata;
            next();
        });
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;

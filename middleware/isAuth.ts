import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import User from "../models/user";
import { CustomErrorType } from "../interfaces/appInterface";
import { UserSchema } from "../interfaces/models/user";

const authSchema = z.object({
    authorization: z.string().min(1, "Authorization header is required"),
});

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = authSchema.parse(req.headers);

        const token = authorization.replace("Bearer ", "");

        jwt.verify(token, process.env.JWT_SECRET!, async (err, payload) => {
            if (err || !payload) {
                const error: CustomErrorType = new Error("Your session has expired.");
                (error as any).statusCode = 401;
                return next(error);
            }

            const { userId } = payload as JwtPayload;

            const userdata = await User.findById(userId);

            if (!userdata) {
                const error: CustomErrorType = new Error("User not found.");
                (error as any).statusCode = 404;
                return next(error);
            }

            const validationResult = UserSchema.safeParse(userdata);
            if (!validationResult.success) {
                const error: CustomErrorType = new Error("User data is invalid.");
                (error as any).statusCode = 500;
                return next(error);
            }

            req.user = validationResult.data;
            next();
        });
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;

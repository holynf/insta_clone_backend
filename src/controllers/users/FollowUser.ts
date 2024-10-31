import { NextFunction, Request, Response } from "express";
import ErrorValidationResult from "../../utils/ErrorValidationResult";
import User from "../../models/user";

export const FollowUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user._id) {
            return ErrorValidationResult({
                code: 400,
                errorBody: "User ID is not provided.",
            });
        }

        if (req.user._id.toString() === req.body.followId) {
            return ErrorValidationResult({
                code: 422,
                errorBody: "You Can't Follow YourSelf!",
            });
        }

        const existingFollower = await User.findOne({
            _id: req.body.followId,
            followers: req.user._id,
        });

        if (existingFollower) {
            return ErrorValidationResult({
                code: 422,
                errorBody: "You already follow this user!",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true },
        );

        if (updatedUser) {
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $push: { following: req.body.followId },
                },
                { new: true },
            )
                .select("-password")
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    return res.status(422).json({ error: err });
                });
        } else {
            return ErrorValidationResult({
                code: 404,
                errorBody: "User not found!",
            });
        }
    } catch (err: any) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};

export default FollowUser;

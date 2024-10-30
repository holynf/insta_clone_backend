import Post from "../models/post";
import User from "../models/user";
import { NextFunction, Request, Response } from "express";
import { PostModelType } from "../interfaces/models/post";
import ErrorValidationResult from "../utils/ErrorValidationResult";

export const user = (req: Request, res: Response) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            Post.find({ posted_by: req.params.id })
                .populate("posted_by", "_id name username")
                .exec((err, result) => {
                    if (err) return res.status(422).json();
                    const posts: PostModelType[] = [];
                    result.map((item) => {
                        posts.push({
                            _id: item._id,
                            title: item.title,
                            body: item.body,
                            posted_by: item.posted_by,
                            photo: item.photo?.toString(),
                            likes: item.likes,
                            comments: item.comments,
                        });
                    });
                    res.json({ user, posts });
                });
        })
        .catch((err) => {
            return res.status(404).json({ Error: "User not found" });
        });
};

export const updatePicture = (req: Request, res: Response) => {
    if (!req.file) {
        return ErrorValidationResult({
            code: 422,
            errorBody: "No image provided.",
        });
    }

    User.findByIdAndUpdate(
        req.user._id,
        { $set: { photo: req.file?.path } },
        { new: true },
        (err, result) => {
            if (err) {
                return ErrorValidationResult({
                    code: 422,
                    errorBody: "You Can't Update Your Picture!",
                });
            }
            res.json({ user: { _id: req.user._id, name: req.user.name } });
        },
    );
};

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
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

export const unfollowUser = (req: Request, res: Response) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        {
            $pull: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $pull: { following: req.body.unfollowId },
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
        },
    );
};

export const userSearch = (req: Request, res: Response) => {
    let pattern = new RegExp("^" + req.body.pattern);
    User.find({ username: { $regex: pattern } })
        .select("_id email name username")
        .then((user) => {
            res.json({ user });
        })
        .catch((err) => {
            console.log(err);
        });
};

const controller = {
    userSearch,
    unfollowUser,
    followUser,
    user,
    updatePicture,
};
export default controller;

import { NextFunction, Request, Response } from "express";
import Post from "../../models/post";
import { PostModelType } from "../../interfaces/models/post";

export const UsersPosts = (req: Request, res: Response, next: NextFunction) => {
    Post.find({ posted_by: req.user._id })
        .populate("posted_by", "_id name")
        .populate("comments.posted_by", "_id name")
        .sort("-created_at")
        .then((data) => {
            let posts: PostModelType[] = [];
            data.map((item) => {
                posts.push({
                    _id: item._id,
                    title: item.title,
                    body: item.body,
                    photo: item.photo ? item.photo.toString() : undefined,
                    likes: item.likes,
                    comments: item.comments,
                });
            });
            res.json({ posts });
        })
        .catch((err) => {
            next(err);
        });
};

export default UsersPosts;

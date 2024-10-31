import { NextFunction, Request, Response } from "express";
import ErrorValidationResult from "../../utils/ErrorValidationResult";
import Post from "../../models/post";

export const UnLikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user._id) {
            return ErrorValidationResult({
                code: 400,
                errorBody: "User ID is not provided.",
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true },
        )
            .populate("posted_by", "_id name email")
            .populate("comments.posted_by", "_id name email");

        if (!updatedPost) {
            return ErrorValidationResult({
                code: 404,
                errorBody: "Post not found!",
            });
        }

        res.json({
            _id: updatedPost._id,
            title: updatedPost.title,
            body: updatedPost.body,
            posted_by: updatedPost.posted_by,
            photo: updatedPost.photo?.toString(),
            likes: updatedPost.likes,
            comments: updatedPost.comments,
        });
    } catch (err: any) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};
export default UnLikePost;

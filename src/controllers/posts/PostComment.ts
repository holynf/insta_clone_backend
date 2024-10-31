import { NextFunction, Request, Response } from "express";
import Post from "../../models/post";
import ErrorValidationResult from "../../utils/ErrorValidationResult";

export const PostComment = async (req: Request, res: Response, next: NextFunction) => {
    const comment = { text: req.body.text, posted_by: req.user._id };

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { comments: comment },
            },
            { new: true },
        )
            .populate("comments.posted_by", "_id name email")
            .populate("posted_by", "_id name email");

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

export default PostComment;

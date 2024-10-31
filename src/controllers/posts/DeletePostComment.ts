import { NextFunction, Request, Response } from "express";
import Post from "../../models/post";
import ErrorValidationResult from "../../utils/ErrorValidationResult";

export const DeletePostComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, commentId } = req.body;

        const post = await Post.findById(postId)
            .populate("comments.posted_by", "_id name email")
            .populate("posted_by", "_id name email");

        if (!post) {
            return ErrorValidationResult({
                code: 404,
                errorBody: "Post not found!",
            });
        }

        const commentIndex = post?.comments.findIndex(
            (comment) => comment._id.toString() === commentId,
        );

        if (commentIndex === -1) {
            return ErrorValidationResult({
                code: 404,
                errorBody: "Comment not found!",
            });
        }

        post.comments.splice(commentIndex, 1);

        const updatedPost = await post.save();

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

export default DeletePostComment;

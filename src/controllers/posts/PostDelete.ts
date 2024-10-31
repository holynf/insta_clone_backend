import { NextFunction, Request, Response } from "express";
import Post from "../../models/post";
import ErrorValidationResult from "../../utils/ErrorValidationResult";

export const PostDelete = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    try {
        const deletedPost = await Post.findOne({ _id: postId }).populate("posted_by", "_id");
        if (!deletedPost) {
            return ErrorValidationResult({
                code: 404,
                errorBody: "Post not found!",
            });
        }
        if (deletedPost.posted_by?._id.toString() === req.user._id!.toString()) {
            deletedPost
                .remove()
                .then((result) => {
                    res.json({
                        message: "Post deleted successfully",
                        deleted_post_id: result._id,
                    });
                })
                .catch((err) => {
                    throw err;
                });
        }
    } catch (err: any) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};

export default PostDelete;

import { validationResult } from "express-validator";
import Post from "../models/post";
import { CustomErrorType } from "../interfaces/appInterface";
import { NextFunction, Request, Response } from "express";
import { PostModelType } from "../interfaces/models/post";

export const postsList = (req: Request, res: Response, next: NextFunction) => {
    Post.find()
        .populate("posted_by", "_id name email")
        .populate("comments.posted_by", "_id name email")
        .sort("-created_at")
        .then((data) => {
            let posts: PostModelType[] = [];
            data.map((item) => {
                posts.push({
                    _id: item._id,
                    title: item.title,
                    body: item.body,
                    posted_by: item.posted_by,
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

export const subPost = (req: Request, res: Response, next: NextFunction) => {
    Post.find({ posted_by: { $in: req.user.following } })
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
                    posted_by: item.posted_by,
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

export const myPost = (req: Request, res: Response, next: NextFunction) => {
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

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error: CustomErrorType = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }

    const { title, body } = req.body;

    const post = new Post({
        title: title,
        body: body,
        posted_by: req.user,
    });

    post.save()
        .then((result) => {
            res.json({
                message: "Post created successfully",
                creator: { _id: req.user._id, name: req.user.name },
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user._id) {
            const error: CustomErrorType = new Error("User ID is not provided.");
            error.statusCode = 400;
            return next(error);
        }

        // Check if the user has already liked the post
        const existingLike = await Post.findOne({
            _id: req.body.postId,
            likes: req.user._id,
        });

        if (existingLike) {
            const error: CustomErrorType = new Error("You already liked this post!");
            error.statusCode = 422;
            throw error;
        }

        // Add the user's like to the post
        const updatedPost = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true },
        )
            .populate("posted_by", "_id name email")
            .populate("comments.posted_by", "_id name email");

        if (!updatedPost) {
            const error: CustomErrorType = new Error("Post not found!");
            error.statusCode = 404;
            throw error;
        }

        // Respond with the updated post data
        res.json({
            _id: updatedPost._id,
            title: updatedPost.title,
            body: updatedPost.body,
            posted_by: updatedPost.posted_by,
            photo: updatedPost.photo?.toString(),
            likes: updatedPost.likes,
            comments: updatedPost.comments,
        });
    } catch (error) {
        next(error);
    }
};

export const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user._id) {
            const error: CustomErrorType = new Error("User ID is not provided.");
            error.statusCode = 400;
            return next(error);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true },
        )
            .populate("posted_by", "_id name email")
            .populate("comments.posted_by", "_id name email");

        if (!updatedPost) {
            const error: CustomErrorType = new Error("Post not found!");
            error.statusCode = 404;
            throw error;
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

export const commentPost = async (req: Request, res: Response, next: NextFunction) => {
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
            const error: CustomErrorType = new Error("Post not found!");
            error.statusCode = 404;
            throw error;
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

export const deleteCommentPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, commentId } = req.body;

        const post = await Post.findById(postId)
            .populate("comments.posted_by", "_id name email")
            .populate("posted_by", "_id name email");

        if (!post) {
            const error: CustomErrorType = new Error("Post not found!");
            error.statusCode = 404;
            throw error;
        }

        const commentIndex = post?.comments.findIndex(
            (comment) => comment._id.toString() === commentId,
        );

        if (commentIndex === -1) {
            const error: CustomErrorType = new Error("Comment not found!");
            error.statusCode = 404;
            throw error;
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

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    try {
        const deletedPost = await Post.findOne({ _id: postId }).populate("posted_by", "_id");
        if (!deletedPost) {
            const err: CustomErrorType = new Error("post NOT found!");
            err.statusCode = 404;
            throw err;
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

const controller = {
    postsList,
    createPost,
    deletePost,
    deleteCommentPost,
    commentPost,
    likePost,
    unlikePost,
    myPost,
    subPost,
};
export default controller;

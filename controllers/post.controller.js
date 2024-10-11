const { validationResult } = require("express-validator");
const Post = require("../models/post.model");

exports.postsList = (req, res, next) => {
    console.log(req.user);
    Post.find()
        .populate("posted_by", "_id name email")
        .populate("comments.posted_by", "_id name email")
        .sort("-created_at")
        .then((data) => {
            let posts = [];
            data.map((item) => {
                posts.push({
                    _id: item._id,
                    title: item.title,
                    body: item.body,
                    posted_by: item.posted_by,
                    photo: item.photo.toString("base64"),
                    likes: item.likes,
                    comments: item.comments,
                });
            });
            res.json({ posts });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.subPost = (req, res) => {
    Post.find({ posted_by: { $in: req.user.following } })
        .populate("posted_by", "_id name")
        .populate("comments.posted_by", "_id name")
        .sort("-created_at")
        .then((data) => {
            let posts = [];
            data.map((item) => {
                posts.push({
                    _id: item._id,
                    title: item.title,
                    body: item.body,
                    posted_by: item.posted_by,
                    photo: item.photo.toString("base64"),
                    likes: item.likes,
                    comments: item.comments,
                });
            });
            res.json({ posts });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.myPost = (req, res) => {
    Post.find({ posted_by: req.user._id })
        .populate("posted_by", "_id name")
        .populate("comments.posted_by", "_id name")
        .sort("-created_at")
        .then((data) => {
            let posts = [];
            data.map((item) => {
                posts.push({
                    _id: item._id,
                    title: item.title,
                    body: item.body,
                    // posted_by: item.posted_by,
                    photo: item.photo.toString("base64"),
                    likes: item.likes,
                    comments: item.comments,
                });
            });
            res.json({ posts });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
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

exports.likePost = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            const error = new Error("User ID is not provided.");
            error.statusCode = 400;
            return next(error);
        }

        // Check if the user has already liked the post
        const existingLike = await Post.findOne({
            _id: req.body.postId,
            likes: req.user._id,
        });

        if (existingLike) {
            const error = new Error("You already liked this post!");
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
            const error = new Error("Post not found!");
            error.statusCode = 404;
            throw error;
        }

        // Respond with the updated post data
        res.json({
            _id: updatedPost._id,
            title: updatedPost.title,
            body: updatedPost.body,
            posted_by: updatedPost.posted_by,
            photo: updatedPost.photo?.toString("base64"),
            likes: updatedPost.likes,
            comments: updatedPost.comments,
        });
    } catch (error) {
        // Pass any error to the next middleware
        next(error);
    }
};

exports.unlikePost = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            const error = new Error("User ID is not provided.");
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
            const error = new Error("Post not found!");
            error.statusCode = 404;
            throw error;
        }

        res.json({
            _id: updatedPost._id,
            title: updatedPost.title,
            body: updatedPost.body,
            posted_by: updatedPost.posted_by,
            photo: updatedPost.photo?.toString("base64"),
            likes: updatedPost.likes,
            comments: updatedPost.comments,
        });
    } catch (error) {
        error.statusCode = error.statusCode || 500;
        next(error);
    }
};

exports.commentPost = async (req, res, next) => {
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
            const error = new Error("Post not found!");
            error.statusCode = 404;
            throw error;
        }

        res.json({
            _id: updatedPost._id,
            title: updatedPost.title,
            body: updatedPost.body,
            posted_by: updatedPost.posted_by,
            photo: updatedPost.photo?.toString("base64"),
            likes: updatedPost.likes,
            comments: updatedPost.comments,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const deletedPost = await Post.findOne({ _id: postId }).populate("posted_by", "_id");
        if (!deletedPost) {
            const err = new Error("post NOT found!");
            err.statusCode = 404;
            throw err;
        }
        if (deletedPost.posted_by._id.toString() === req.user._id.toString()) {
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
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};

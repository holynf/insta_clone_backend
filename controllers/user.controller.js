const Post = require("../models/post");
const User = require("../models/user");

exports.user = (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            Post.find({ posted_by: req.params.id })
                .populate("posted_by", "_id name username")
                .exec((err, result) => {
                    if (err) return res.status(422).json();
                    const posts = [];
                    result.map((item) => {
                        posts.push({
                            _id: item._id,
                            title: item.title,
                            body: item.body,
                            posted_by: item.posted_by,
                            photo: item.photo?.toString("base64"),
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

exports.followUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            const error = new Error("User ID is not provided.");
            error.statusCode = 400;
            throw error;
        }

        if (req.user._id.toString() === req.body.followId) {
            const error = new Error("You Can't Follow YourSelf!");
            error.statusCode = 422;
            throw error;
        }

        const existingFollower = await User.findOne({
            _id: req.body.followId,
            followers: req.user._id,
        });

        if (existingFollower) {
            const error = new Error("You already follow this user!");
            error.statusCode = 422;
            throw error;
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
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};

exports.unfollowUser = (req, res) => {
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

exports.userSearch = (req, res) => {
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

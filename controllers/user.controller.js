const Post = require("../models/post.model");
const User = require("../models/user.model");

exports.user = (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            Post.find({ posted_by: req.params.id })
                .populate("posted_by", "_id name")
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

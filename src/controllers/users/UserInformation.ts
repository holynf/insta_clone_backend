import { Request, Response } from "express";
import User from "../../models/user";
import Post from "../../models/post";
import { PostModelType } from "../../interfaces/models/post";

export const UserInformation = (req: Request, res: Response) => {
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

export default UserInformation;

import mongoose, { model } from "mongoose";
import { Post as PostModel } from "../interfaces/models/post";

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            default: "no photo",
        },
        posted_by: { type: ObjectId, ref: "User" },
        likes: [{ type: ObjectId, ref: "User", default: [] }],
        comments: [
            {
                text: String,
                posted_by: {
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true },
);

const Post = model<PostModel>("Post", postSchema);
export default Post;

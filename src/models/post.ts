import mongoose, { model } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
import { PostModelType } from "../interfaces/models/post";

const postSchema = new mongoose.Schema<PostModelType>(
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
                    _id: ObjectId,
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true },
);

const Post = model<PostModelType>("Post", postSchema);
export default Post;

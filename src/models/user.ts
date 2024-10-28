import mongoose, { model } from "mongoose";
import { UserModelType } from "../interfaces/models/user";

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema<UserModelType>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: "no photo",
        required: true,
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    bookmarks: [{ type: ObjectId, ref: "Post" }],
});

const User = model<UserModelType>("User", userSchema);
export default User;

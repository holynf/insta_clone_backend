import mongoose, { model } from "mongoose";
import { User as UserModel } from "../interfaces/models/user";

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema<UserModel>({
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
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    bookmarks: [{ type: ObjectId, ref: "Post" }],
});

const User = model<UserModel>("User", userSchema);
export default User;

import mongoose from "mongoose";

export interface User {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    name: string;
    username: string;
    photo: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    bookmarks: mongoose.Types.ObjectId[];
}

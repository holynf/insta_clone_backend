import mongoose from "mongoose";

export interface Post {
    _id: mongoose.Types.ObjectId;
    title: string;
    body: string;
    photo: string;
    posted_by: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    comments: CommentType;
}

export interface CommentType {
    text: string;
    posted_by: mongoose.Types.ObjectId;
}

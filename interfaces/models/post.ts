import { z } from "zod";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export const CommentTypeSchema = z.object({
    text: z.string(),
    posted_by: z.string(),
});

export const PostSchema = z.object({
    _id: z.instanceof(ObjectId),
    title: z.string().min(1, "Title is required"),
    body: z.string().min(5, "Body must be at least 5 characters long"),
    photo: z.string().optional(),
    posted_by: z.instanceof(ObjectId),
    likes: z.array(z.instanceof(ObjectId)).default([]),
    comments: z
        .array(
            z.object({
                text: z.string(),
                posted_by: z.instanceof(ObjectId),
            }),
        )
        .default([]),
});

export const createPostSchema = z.object({
    body: z.string().min(5),
    title: z.string(),
});

export type PostModelType = z.infer<typeof PostSchema>;

module.exports = {
    PostSchema,
    createPostSchema,
};

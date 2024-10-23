import { z } from "zod";

export const UserSchema = z.object({
    _id: z.string(),
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    username: z.string(),
    photo: z.string().optional(),
    followers: z.array(z.string()),
    following: z.array(z.string()),
    bookmarks: z.array(z.string()),
});

export const userRegistrationSchema = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export const userLoginSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});

export type User = z.infer<typeof UserSchema>;

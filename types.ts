import express from "express";

declare global {
    namespace Express {
        interface Request {
            user: {
                _id?: string;
                email?: string;
                password?: string;
                name?: string;
                username?: string;
                photo?: string;
                followers?: string[];
                following?: string[];
                bookmarks?: string[];
            };
        }
    }
}

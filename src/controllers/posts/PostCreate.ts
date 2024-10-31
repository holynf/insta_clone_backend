import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ErrorValidationResult from "../../utils/ErrorValidationResult";
import Post from "../../models/post";

export const PostCreate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ErrorValidationResult({
            code: 422,
            errorBody: "Validation failed, entered data is incorrect.",
        });
    }
    if (!req.file) {
        return ErrorValidationResult({
            code: 422,
            errorBody: "No image provided.",
        });
    }
    const photoUrl = req.file?.path;
    const { title, body } = req.body;

    const post = new Post({
        title: title,
        body: body,
        posted_by: req.user,
        photo: photoUrl,
    });

    post.save()
        .then((result) => {
            res.json({
                message: "Post created successfully",
                creator: { _id: req.user._id, name: req.user.name },
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

export default PostCreate;

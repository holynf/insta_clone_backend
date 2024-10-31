import { Request, Response } from "express";
import ErrorValidationResult from "../../utils/ErrorValidationResult";
import User from "../../models/user";

export const UpdateUserProfilePicture = (req: Request, res: Response) => {
    if (!req.file) {
        return ErrorValidationResult({
            code: 422,
            errorBody: "No image provided.",
        });
    }

    User.findByIdAndUpdate(
        req.user._id,
        { $set: { photo: req.file?.path } },
        { new: true },
        (err, result) => {
            if (err) {
                return ErrorValidationResult({
                    code: 422,
                    errorBody: "You Can't Update Your Picture!",
                });
            }
            res.json({ user: { _id: req.user._id, name: req.user.name } });
        },
    );
};
export default UpdateUserProfilePicture;

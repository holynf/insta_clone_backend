import { Request, Response } from "express";
import User from "../../models/user";

export const UnFollowUser = (req: Request, res: Response) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        {
            $pull: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $pull: { following: req.body.unfollowId },
                },
                { new: true },
            )
                .select("-password")
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    return res.status(422).json({ error: err });
                });
        },
    );
};

export default UnFollowUser;

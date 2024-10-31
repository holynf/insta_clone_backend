import { Request, Response } from "express";
import User from "../../models/user";

export const UserSearch = (req: Request, res: Response) => {
    let pattern = new RegExp("^" + req.body.pattern);
    User.find({ username: { $regex: pattern } })
        .select("_id email name username")
        .then((user) => {
            res.json({ user });
        })
        .catch((err) => {
            console.log(err);
        });
};

export default UserSearch;

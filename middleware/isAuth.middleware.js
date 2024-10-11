const jwt = require("jsonwebtoken");
const User = require("./../models/user.model");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            const error = new Error("You session has been expired.");
            error.statusCode = 401;
            throw error;
        }
        const { userId } = payload;
        User.findById(userId).then((userdata) => {
            req.user = userdata;
            next();
        });
    });
};

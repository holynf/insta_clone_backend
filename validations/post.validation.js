const { body } = require("express-validator");

exports.createPostValidation = () => {
    return [body("body").trim().isLength({ min: 5 }), body("title").trim().not().isEmpty()];
};

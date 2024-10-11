const express = require("express");
const router = express.Router();
const postsRouter = require("./post.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const isAuth = require("../middleware/isAuth.middleware");

router.use("/auth", authRouter);
router.use("/posts", isAuth, postsRouter);
router.use("/user", isAuth, userRouter);

module.exports = router;

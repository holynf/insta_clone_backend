import express from "express";
const router = express.Router();
import postsRouter from "./post.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import isAuth from "../middleware/isAuth";

router.use("/auth", authRouter);
router.use("/posts", isAuth, postsRouter);
router.use("/user", isAuth, userRouter);

module.exports = router;

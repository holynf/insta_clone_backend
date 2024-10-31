import express from "express";
import { validateData } from "../middleware/validationMiddleware";
import { createPostSchema } from "../interfaces/models/post";
import PostsList from "../controllers/posts/PostsList";
import SubscriptionPosts from "../controllers/posts/SubscriptionPosts";
import UsersPosts from "../controllers/posts/UsersPosts";
import PostCreate from "../controllers/posts/PostCreate";
import LikePost from "../controllers/posts/LikePost";
import UnLikePost from "../controllers/posts/UnLikePost";
import PostComment from "../controllers/posts/PostComment";
import DeletePostComment from "../controllers/posts/DeletePostComment";
import PostDelete from "../controllers/posts/PostDelete";
const router = express.Router();

router.get("/list", PostsList);
router.get("/sub_posts", SubscriptionPosts);
router.get("/my_posts", UsersPosts);

router.post("/create", validateData(createPostSchema), PostCreate);

router.put("/like", LikePost);
router.put("/unlike", UnLikePost);
router.put("/comment", PostComment);
router.put("/delete-comment", DeletePostComment);

router.delete("/:postId", PostDelete);

export default router;

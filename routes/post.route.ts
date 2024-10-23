import controller from "../controllers/post";
import express from "express";
const router = express.Router();

import { validateData } from "../middleware/validationMiddleware";
import { createPostSchema } from "../interfaces/models/post";

router.get("/list", controller.postsList);
router.get("/sub_posts", controller.subPost);
router.get("/my_posts", controller.myPost);

router.post("/create", validateData(createPostSchema), controller.createPost);

router.put("/like", controller.likePost);
router.put("/unlike", controller.unlikePost);
router.put("/comment", controller.commentPost);
router.put("/delete-comment", controller.deleteCommentPost);

router.delete("/:postId", controller.deletePost);

module.exports = router;

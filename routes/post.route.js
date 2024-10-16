const controller = require("../controllers/post.controller");
const validation = require("../validations/post.validation");
const express = require("express");
const router = express.Router();

router.get("/list", controller.postsList);
router.get("/sub_posts", controller.subPost);
router.get("/my_posts", controller.myPost);

router.post("/create", validation.createPostValidation(), controller.createPost);

router.put("/like", controller.likePost);
router.put("/unlike", controller.unlikePost);
router.put("/comment", controller.commentPost);
router.put("/delete-comment", controller.deleteCommentPost);

router.delete("/:postId", controller.deletePost);

module.exports = router;

import express from "express";
const router = express.Router();
import controller from "../controllers/user";

router.get("/:id", controller.user);
router.put("/follow", controller.followUser);
router.put("/unfollow", controller.unfollowUser);
router.post("/users-search", controller.userSearch);
router.post("/update-picture", controller.updatePicture);

export default router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.get("/:id", controller.user);
router.put("/follow", controller.followUser);
router.put("/unfollow", controller.unfollowUser);
router.post("/users-search", controller.userSearch);

module.exports = router;

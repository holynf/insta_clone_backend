import express from "express";
import UserInformation from "../controllers/users/UserInformation";
import FollowUser from "../controllers/users/FollowUser";
import UnFollowUser from "../controllers/users/UnFollowUser";
import UserSearch from "../controllers/users/UserSearch";
import UpdateUserProfilePicture from "../controllers/users/UpdateUserProfilePicture";

const router = express.Router();

router.get("/:id", UserInformation);
router.put("/follow", FollowUser);
router.put("/unfollow", UnFollowUser);
router.post("/users-search", UserSearch);
router.post("/update-picture", UpdateUserProfilePicture);

export default router;

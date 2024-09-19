const express = require("express");
const router = express.Router();

const { getUser, getAllUsers, followUser, unfollowUser, likeVideo, unlikeVideo } = require("../controllers/users");

router.route("/:id").get(getUser)
router.route("/").get(getAllUsers);
router.route("/follow/:id").patch(followUser)
router.route("/unfollow/:id").patch(unfollowUser)
router.route("/like/:id").patch(likeVideo)
router.route("/unlike/:id").patch(unlikeVideo)

module.exports = router;

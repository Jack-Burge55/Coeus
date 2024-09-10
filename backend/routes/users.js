const express = require("express");
const router = express.Router();

const { getUser, getAllUsers, followUser, unfollowUser } = require("../controllers/users");

router.route("/:id").get(getUser)
router.route("/").get(getAllUsers);
router.route("/follow/:id").patch(followUser)
router.route("/unfollow/:id").patch(unfollowUser)

module.exports = router;

const express = require("express");
const router = express.Router();
const { deleteUser, loginUser, registerUser } = require("../controllers/auth");

router.route("/delete/:id").delete(deleteUser);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

module.exports = router;

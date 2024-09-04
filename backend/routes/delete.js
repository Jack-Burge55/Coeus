const express = require("express");
const router = express.Router();

const { deleteUser } = require("../controllers/delete");

router.route("/:id").delete(deleteUser);

module.exports = router;

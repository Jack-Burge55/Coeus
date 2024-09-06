const express = require("express")
const router = express.Router()

const {getAllVideosByUser, uploadVideo} = require("../controllers/videos")

router.route("/").post(uploadVideo)
router.route("/:id").get(getAllVideosByUser)

module.exports = router

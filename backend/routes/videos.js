const express = require("express")
const router = express.Router()

const {getAllVideosByUser, uploadVideo, deleteVideo} = require("../controllers/videos")

router.route("/").post(uploadVideo).delete(deleteVideo)
router.route("/:id").get(getAllVideosByUser)

module.exports = router

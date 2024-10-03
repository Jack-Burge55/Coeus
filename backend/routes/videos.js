const express = require("express")
const router = express.Router()

const {getAllVideosByUser, uploadVideo, getAllVideos, getAllOtherVideos, deleteVideo, getVideo, getAllVideosByLike, getAllVideosByTopic} = require("../controllers/videos")

router.route("/").post(uploadVideo).delete(deleteVideo).get(getVideo)
router.route("/all").get(getAllVideos)
router.route("/all-other").get(getAllOtherVideos)
router.route("/likes").get(getAllVideosByLike)
router.route("/topic/:topic").get(getAllVideosByTopic)
router.route("/:id").get(getAllVideosByUser)

module.exports = router

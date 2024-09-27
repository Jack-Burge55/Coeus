const express = require("express")
const router = express.Router()

const {getAllVideosByUser, uploadVideo, getAllVideos, deleteVideo, getVideo, getAllVideosByLike} = require("../controllers/videos")

router.route("/").post(uploadVideo).delete(deleteVideo).get(getVideo)
router.route("/all").get(getAllVideos)
router.route("/likes").get(getAllVideosByLike)
router.route("/:id").get(getAllVideosByUser)

module.exports = router

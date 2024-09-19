const express = require("express")
const router = express.Router()

const {getAllVideosByUser, uploadVideo, deleteVideo, getVideo, getAllVideosByLike} = require("../controllers/videos")

router.route("/").post(uploadVideo).delete(deleteVideo).get(getVideo)
router.route("/likes").get(getAllVideosByLike)
router.route("/:id").get(getAllVideosByUser)

module.exports = router

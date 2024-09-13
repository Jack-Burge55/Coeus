const { BadRequestError } = require("../errors")
const Video = require("../models/Video")
const {StatusCodes} = require("http-status-codes")

const getAllVideosByUser = async (req, res) => {  
  const {
    params: {id: userId}
  } = req
  
  const videos = await Video.find({ uploadedBy: userId }).sort("createdAt")
  res.status(StatusCodes.OK).json({videos, count: videos.length})
}

const uploadVideo = async (req, res) => {
  req.body.uploadedBy = req.user.userId
  // check url isn't already a video
  const allVideos = await Video.find({ url: req.body.url })
  if (allVideos.length > 0) return res.status(StatusCodes.BAD_REQUEST).send("Duplicate, video already uploaded")
  
  const video = await Video.create(req.body)
  
  res.status(StatusCodes.CREATED).json({video})
}

const deleteVideo = async (req, res, next) => {
  const { videoId } = req.body
  const video = await Video.findByIdAndDelete({ _id: videoId })
  if (!video) {
    return next(new BadRequestError(`No video with id: ${videoId} found`))
  }
  res.status(StatusCodes.OK).json({ videoId: video._id, url: video.url})
}

module.exports = {
  getAllVideosByUser,
  uploadVideo,
  deleteVideo
}
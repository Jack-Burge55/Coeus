const Video = require("../models/Video")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError, NotFoundError} = require("../errors")

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
  if (allVideos.length > 0) return res.status(StatusCodes.BAD_REQUEST).json("Duplicate, video already uploaded")
  
  const video = await Video.create(req.body)
  
  res.status(StatusCodes.CREATED).json({video})
}

module.exports = {
  getAllVideosByUser,
  uploadVideo
}
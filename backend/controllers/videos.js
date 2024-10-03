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

const getAllVideosByLike = async (req, res, next) => {
  const userId = req.user.userId
  const videos = await Video.find({ likedBy: userId})
  if (!videos) {
    return next(new BadRequestError(`No videos liked by ${userId} found`))
  }
  res.status(StatusCodes.OK).json({videos})
}

const getAllVideosByTopic = async (req, res, next) => {
  const {
    params: {topic}
  } = req
  const videos = await Video.find({ majorTopics: topic})
  if (!videos.length) {
    return next(new BadRequestError(`No videos with topic ${topic} found`))
  }
  res.status(StatusCodes.OK).json({videos})
}

const getAllVideos = async (req, res) => {
  // get videos with newest first
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const videos = await Video.find({}).skip(skip).limit(limit).sort({"createdAt": -1})
  if (!videos) {
    return next(new BadRequestError(`No videos found`))
  }

  res.status(StatusCodes.OK).json({videos})
}

const getAllOtherVideos = async (req, res, next) => {
  // get videos with newest first from other users
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const videos = await Video.find({ uploadedBy: {$ne: req.user.userId} }).skip(skip).limit(limit).sort({"createdAt": -1})
  if (!videos.length) {
    return next(new BadRequestError(`No videos found`))
  }

  res.status(StatusCodes.OK).json({videos})
}

const getVideo = async (req, res, next) => {  
  const {videoId} = req.body
  const video = await Video.findById({_id: videoId}).sort("createdAt")
  if (!video) {
    return next(new BadRequestError(`No video with id: ${videoId} found`))
  }
  res.status(StatusCodes.OK).json({video})
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
  getAllVideosByLike,
  getAllVideosByTopic,
  getAllVideos,
  getAllOtherVideos,
  getVideo,
  uploadVideo,
  deleteVideo
}

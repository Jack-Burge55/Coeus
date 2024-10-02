const { BadRequestError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const Video = require("../models/Video");

const getUser = async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findById({ _id: userId });

  if (!user) {
    return next(new BadRequestError(`No user with id: ${userId} found`));
  }
  res.status(StatusCodes.OK).json({
    userId: user._id,
    username: user.username,
    email: user.email,
    follows: user.follows,
    likedVideos: user.likedVideos
  });
};

const getAllUsers = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) + 1 || 11;
  const skip = (page - 1) * Number(req.query.limit);

  const users = await User.find({}).skip(skip).limit(limit);
  if (!users) {
    return next(new BadRequestError("No users found"));
  }
  const cleanedUsers = users.map((user) => {
    return {
      username: user.username,
      _id: user._id,
      email: user.email,
    };
  });

  res.status(StatusCodes.OK).json({ cleanedUsers });
};

const followUser = async (req, res, next) => {
  const { userId } = req.user;
  const { id: followId } = req.params;
  const userToFollow = await User.findById({ _id: followId });
  if (!userToFollow) {
    return next(new BadRequestError(`No user with id: ${followId} found`));
  }
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { $addToSet: { follows: followId } },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ user });
};

const unfollowUser = async (req, res, next) => {
  const { userId } = req.user;
  const { id: followId } = req.params;
  const userToUnfollow = await User.findById({ _id: followId });
  if (!userToUnfollow) {
    return next(new BadRequestError(`No user with id: ${followId} found`));
  }
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { follows: followId } },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ user });
};

const likeVideo = async (req, res, next) => {
  const { userId } = req.user;
  const { id: videoId } = req.params;
  const video = await Video.findById({ _id: videoId });
  let user = await User.findById({ _id: userId });

  if (!video) {
    return next(new BadRequestError(`No video with id: ${videoId} found`));
  }

  if (video.uploadedBy.toString() === userId) {
    return next(new BadRequestError("User cannot like their own videos"));
  }

  if (!user.likedVideos.includes(videoId)) {
    await Video.findByIdAndUpdate(
      { _id: videoId },
      { likeCount: video.likeCount + 1, likedBy: [...video.likedBy, userId] },
      { new: true, runValidators: true }
    );
    user = await User.findByIdAndUpdate(
      { _id: userId },
      { $addToSet: { likedVideos: videoId } },
      { new: true, runValidators: true }
    );
  }

  res.status(StatusCodes.OK).json({ user });
};

const unlikeVideo = async (req, res, next) => {
  const { userId } = req.user;
  const { id: videoId } = req.params;
  const video = await Video.findById({ _id: videoId });
  let user = await User.findById({ _id: userId });

  if (!video) {
    return next(new BadRequestError(`No video with id: ${videoId} found`));
  }

  if (video.uploadedBy.toString() === userId) {
    return next(new BadRequestError("User cannot unlike their own videos"));
  }

  if (user.likedVideos.includes(videoId)) {
    await Video.findByIdAndUpdate(
      { _id: videoId },
      {
        likeCount: video.likeCount - 1,
        likedBy: video.likedBy.filter((e) => e !== userId),
      },
      { new: true, runValidators: true }
    );
    user = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { likedVideos: videoId } },
      { new: true, runValidators: true }
    );
  }

  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getUser,
  getAllUsers,
  followUser,
  unfollowUser,
  likeVideo,
  unlikeVideo,
};

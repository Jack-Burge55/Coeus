const { BadRequestError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res, next) => {  
  const { id: userId } = req.params;

  const user = await User.findById({ _id: userId });

  if (!user) {
    return next(new BadRequestError(`No user with id: ${userId} found`));
  }
  res
    .status(StatusCodes.OK)
    .json({ userId: user._id, username: user.username, email: user.email, follows: user.follows });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new BadRequestError("No users found"))
  }
  const cleanedUsers = users.map(user => {
    return {
      "username": user.username,
      "_id": user._id,
      "email": user.email
    }
  })
  
  res.status(StatusCodes.OK)
  .json({cleanedUsers})
}

const followUser = async (req, res, next) => {
  const {userId} = req.user
  const { id: followId} = req.params
  const userToFollow = await User.findById({_id: followId})
  console.log(userToFollow);
  if (!userToFollow) {
    return next(new BadRequestError(`No user with id: ${followId} found`));
  }
  const user = await User.findByIdAndUpdate({_id: userId}, { $addToSet: { follows: followId } }, {new:true, runValidators: true} )
  res.status(StatusCodes.OK)
  .json({user})
}

const unfollowUser = async (req, res, next) => {
  const {userId} = req.user
  const { id: followId} = req.params
  const userToUnfollow = await User.findById({_id: followId})
  console.log(userToUnfollow);
  if (!userToUnfollow) {
    return next(new BadRequestError(`No user with id: ${followId} found`));
  }
  const user = await User.findByIdAndUpdate({_id: userId}, { $pull: { follows: followId } }, {new:true, runValidators: true} )
  res.status(StatusCodes.OK)
  .json({user})
}

module.exports = {
  getUser,
  getAllUsers,
  followUser,
  unfollowUser
};

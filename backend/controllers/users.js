const { BadRequestError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res, next) => {
  const { id: userID } = req.params;

  const user = await User.findById({ _id: userID });

  if (!user) {
    return next(new BadRequestError(`No user with id: ${userID} found`));
  }
  res
    .status(StatusCodes.OK)
    .json({ userId: user._id, username: user.username, email: user.email });
};

module.exports = {
  getUser,
};

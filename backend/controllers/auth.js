const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const deleteUser = async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndDelete({ _id: userId });

  if (!user) {
    return next(new BadRequestError(`No user with id: ${userId} found`));
  }
  res
    .status(StatusCodes.OK)
    .json({ userId: user._id, username: user.username, email: user.email });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError(
      "Please provide a correct email or username and a password"
    );
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // compare password
  const passwordsMatch = await user.comparePassword(password);

  if (!passwordsMatch) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user: { username: user.username, userId: user._id }, token });
};

const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: { username: user.username, userId: user._id },
    token
  });
};

module.exports = {
  deleteUser,
  loginUser,
  registerUser
};

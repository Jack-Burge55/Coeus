const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {  
  const user = await User.create({ ...req.body });
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { username: user.username }, token, userCreated: true });
};

module.exports = {
  registerUser,
};

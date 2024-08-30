const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors")

const loginUser = async (req, res) => {
  
  const {username, password} = req.body
  if (!username || !password) {    
    throw new BadRequestError("Please provide a correct email or username and a password")
  }

  const user = await User.findOne({username})

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  // compare password
  const passwordsMatch = await user.comparePassword(password)

  if (!passwordsMatch) {
    throw new UnauthenticatedError("Invalid Credentials")
  }

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({user: {name: user.username}, token })
}

module.exports = {
  loginUser
};

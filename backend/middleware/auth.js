const jwt = require("jsonwebtoken")
const { UnauthenticatedError } = require("../errors")

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorisation
  
  if (!authHeader?.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Failed")
  }
  const token = authHeader.split(" ")[1]
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the correct routes
    req.user = { userId: payload.userId, username: payload.username }
    
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication failed")
  }
}

module.exports = auth
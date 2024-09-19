const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a valid username"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide a valid password"],
    minlength: 6
  },
  follows: {
    type: Array
  },
  likedVideos: {
    type: Array
  }
})

// hashes password for database
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME
    }
  )
}

UserSchema.methods.comparePassword = async function (passwordAttempt) {
  return await bcrypt.compare(passwordAttempt, this.password) 
}

module.exports = mongoose.model("User", UserSchema)

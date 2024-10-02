const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Please provide a valid url"],
      unique: true,
    },
    majorTopics: {
      type: Array,
      required: [true, "Provide at least one major topic"],
      validate: [majorTopicArrayLimit, "Must have between 1 and 2 major topics"]
    },
    minorTopics: {
      type: Array,
      required: [true, "Provide at least one minor topic"],
      validate: [minorTopicArrayLimit, "Must have between 1 and 3 minor topics"]
    },
    likedBy: {
      type: Array,
      default: []
    },
    likeCount: {
      type: Number,
      default: 0
    },
    uploadedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"]
    },
    uploadedByName: {
      type: String,
      required: [true, "please provide username"]
    }
  },
  { timestamps: true }
);

function majorTopicArrayLimit(val) {  
  return val.length <= 2 && val.length >= 1
}

function minorTopicArrayLimit(val) {  
  return val.length <= 3 && val.length >= 1
}

module.exports = mongoose.model("Video", VideoSchema);

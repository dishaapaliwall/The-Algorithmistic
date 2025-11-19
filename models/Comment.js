const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  page: {
    type: String,
    required: true   // example: "bubble-sort", "binary-search", "linear-search"
  },

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comment", commentSchema);

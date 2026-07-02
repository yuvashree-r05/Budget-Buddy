const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  targetAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Goal", goalSchema);
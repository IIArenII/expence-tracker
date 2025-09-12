const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // ❌ not required for Google users
    },
    googleId: {
      type: String, // store Google’s sub value
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

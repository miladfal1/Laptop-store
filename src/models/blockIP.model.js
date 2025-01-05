const mongoose = require("mongoose");

const blockedIpSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  reason: { type: String, required: true },
  blockedAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 1 * 60 * 1000);
    },
  },
});

module.exports = mongoose.model("BlockedIP", blockedIpSchema);

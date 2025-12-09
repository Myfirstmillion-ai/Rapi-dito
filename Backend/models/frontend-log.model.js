const mongoose = require("mongoose");

const FrontendLogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  formattedTimestamp: {
    type: String,
  },
  params: {
    type: [
      {
        _id: false,
        key: String,
        value: String,
      },
    ],
    default: undefined,
  },
  level: {
    type: String,
    default: "info",
  },
});

// TTL index - auto-delete logs after 30 days
FrontendLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

// Compound index for query optimization
FrontendLogSchema.index({ level: 1, timestamp: -1 });

const FrontendLog = mongoose.model("FrontendLog", FrontendLogSchema);

module.exports = FrontendLog;

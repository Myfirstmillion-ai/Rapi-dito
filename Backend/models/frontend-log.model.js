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
});

// PERFORMANCE & STORAGE: Add TTL index - automatically delete logs after 30 days
FrontendLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days in seconds

// PERFORMANCE: Index for querying by timestamp (most recent first)
FrontendLogSchema.index({ timestamp: -1 });

// PERFORMANCE: Index for filtering by path
FrontendLogSchema.index({ path: 1 });

const FrontendLog = mongoose.model("FrontendLog", FrontendLogSchema);

module.exports = FrontendLog;

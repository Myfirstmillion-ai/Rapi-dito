const mongoose = require("mongoose");

const BackendLogSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  contentLength: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  formattedTimestamp: {
    type: String,
  },
});

// PERFORMANCE & STORAGE: Add TTL index - automatically delete logs after 30 days
BackendLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days in seconds

// PERFORMANCE: Compound index for filtering by method and status
BackendLogSchema.index({ method: 1, status: 1 });

// PERFORMANCE: Index for querying by timestamp (most recent first)
BackendLogSchema.index({ timestamp: -1 });

const BackendLog = mongoose.model("BackendLog", BackendLogSchema);

module.exports = BackendLog;

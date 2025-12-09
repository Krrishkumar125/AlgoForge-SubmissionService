const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID for the submission is missing"],
  },
  problemId: {
    type: String,
    required: [true, "Problem ID for the submission is missing"],
  },
  code: {
    type: String,
    required: [true, "Code for the submission is missing"],
  },
  language: {
    type: String,
    required: [true, "Programming language for the submission is missing"],
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Wrong Answer",
      "Runtime Error",
      "Compilation Error",
      "Time Limit Exceeded",
      "Memory Limit Exceeded",
    ],
    default: "Pending",
  },
});

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;

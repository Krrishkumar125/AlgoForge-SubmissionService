const submissionQueue = require("../queues/submissionQueue.js");

module.exports = async function (payload) {
  await submissionQueue.add("SubmissionJob", payload);
};

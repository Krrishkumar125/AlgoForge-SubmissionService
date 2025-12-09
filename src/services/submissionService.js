const SubmissionProducer = require("../producers/submissionQueueProducer.js");

class SubmissionService {
  constructor(repository) {
    this.submissionRepository = repository;
  }

  async pingCheck() {
    return "pong";
  }

  async addSubmission(submissionData) {
    const createdSubmission = await this.submissionRepository.createSubmission(submissionData);
    if (!createdSubmission) {
      throw new Error("Failed to create submission");
    }
    console.log("Submission created:", createdSubmission);
    const response = await SubmissionProducer(submissionData);
    return {queueResponse: response, createdSubmission};
  }
}

module.exports = SubmissionService;

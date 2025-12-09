const Submission = require("../models/submissionModel.js");

class SubmissionRepository {
  constructor() {
    this.submissionModel = Submission;
  }

  async createSubmission(submissionData) {
    const submission = await this.submissionModel.create(submissionData);
    return submission;
  }
}

module.exports = SubmissionRepository;

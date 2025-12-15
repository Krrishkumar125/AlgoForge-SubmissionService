const { fetchProblemDetails } = require("../apis/problemApi.js");
const SubmissionProducer = require("../producers/submissionQueueProducer.js");

class SubmissionService {
  constructor(repository) {
    this.submissionRepository = repository;
  }

  async pingCheck() {
    return "pong";
  }

  async addSubmission(submissionData) {
    const problemId = submissionData.problemId;
    const userId = submissionData.userId;

    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!problemId) {
      throw new Error("Problem ID is required");
    }

    const problemApiResponse = await fetchProblemDetails(problemId);
    if (!problemApiResponse) {
      throw new Error("Problem not found");
    }

    const languageCodeStub = problemApiResponse.data.codeStubs.find(
      (codeStub) =>
        codeStub.language.toLowerCase() ===
        submissionData.language.toLowerCase()
    );

    console.log(languageCodeStub);

    submissionData.code =
      languageCodeStub.startSnippet +
      "\n\n" +
      submissionData.code +
      "\n\n" +
      languageCodeStub.endSnippet;

    const createdSubmission = await this.submissionRepository.createSubmission(
      submissionData
    );
    if (!createdSubmission) {
      throw new Error("Failed to create submission");
    }
    console.log("Submission created:", createdSubmission);
    const submissionId = createdSubmission.id;
    const response = await SubmissionProducer({
      [submissionId]: {
        userId: userId,
        submissionId: submissionId,
        code: submissionData.code,
        language: submissionData.language,
        inputTestCases: problemApiResponse.data.testCases[0].input,
        outputTestCases: problemApiResponse.data.testCases[0].output,
      },
    });
    return {queueResponse: response, createdSubmission};
  }
}

module.exports = SubmissionService;

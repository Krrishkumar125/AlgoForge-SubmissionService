const { StatusCodes } = require("http-status-codes");

async function pingRequest(req, res) {
  const response = await this.submissionService.pingCheck();
  return res.status(StatusCodes.OK).send({
    success: true,
    data: response,
    message: "ping controller is up",
    error: {},
  });
}

async function createSubmission(req, res) {
  const response = await this.submissionService.addSubmission(req.body);
  return res.status(StatusCodes.CREATED).send({
    success: true,
    data: response,
    message: "submission created successfully",
    error: {},
  });
}

module.exports = {
  pingRequest,
  createSubmission,
};

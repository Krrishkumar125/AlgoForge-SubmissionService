async function pingRequest(req, res) {
  const response = await this.testService.pingCheck();
  return res.send({
    success: true,
    data: response,
    message: "ping controller is up",
    error: {},
  });
}

module.exports = {
  pingRequest,
};

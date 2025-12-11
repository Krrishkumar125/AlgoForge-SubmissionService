const submissionController = require("../../../controllers/submissionController");

async function submissionRoutes(fastify, options) {
  fastify.post("/", submissionController.createSubmission.bind(fastify));
  fastify.get("/ping", (request, reply) => {
    return reply.send("Submission Service is up and running");
  });
}

module.exports = submissionRoutes;

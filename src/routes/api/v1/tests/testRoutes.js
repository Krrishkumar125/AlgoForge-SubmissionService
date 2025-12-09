const testController = require("../../../../controllers/submissionController");

async function testRoutes(fastify, options) {
  fastify.get("/ping", testController.pingRequest.bind(fastify));
}

module.exports = testRoutes;

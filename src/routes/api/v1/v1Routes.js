async function v1Plugin(fastify, options) {
  fastify.register(require("./tests/testRoutes"), { prefix: "/test" });
}

module.exports = v1Plugin;

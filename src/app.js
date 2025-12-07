const fastifyPlugin = require("fastify-plugin");
const servicePlugin = require("./services/servicePlugin");
const apiPlugin = require("./routes/api/apiRoutes");

async function app(fastify, options) {
  fastify.register(require("@fastify/cors"));
  fastify.register(apiPlugin, {
    prefix: "/api",
  });
  fastify.register(servicePlugin);
}

module.exports = fastifyPlugin(app);

const fastifyPlugin = require("fastify-plugin");
const servicePlugin = require("./services/servicePlugin");
const apiPlugin = require("./routes/api/apiRoutes");
const repositoryPlugin = require("./repository/repositoryPlugin");

async function app(fastify, options) {
  await fastify.register(require("@fastify/cors"));
  await fastify.register(repositoryPlugin);
  await fastify.register(servicePlugin);

  await fastify.register(apiPlugin, {
    prefix: "/api",
  });
}

module.exports = fastifyPlugin(app);

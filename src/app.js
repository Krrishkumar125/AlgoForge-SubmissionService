const fastifyPlugin = require("fastify-plugin");
const servicePlugin = require("./services/servicePlugin");
const apiPlugin = require("./routes/api/apiRoutes");
const repositoryPlugin = require("./repository/repositoryPlugin");

async function app(fastify, options) {
  fastify.register(require("@fastify/cors"));
  fastify.register(repositoryPlugin);
  fastify.register(servicePlugin);
  
  fastify.register(apiPlugin, {
    prefix: "/api",
  });
}

module.exports = fastifyPlugin(app);

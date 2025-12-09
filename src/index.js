const app = require("./app");
const connectToDB = require("./config/dbConfig");

const fastify = require("fastify")({ logger: true });

const serverConfig = require("./config/serverConfig");

fastify.register(app);

fastify.listen({ port: serverConfig.PORT }, async (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  await connectToDB();
  console.log(`Server up at port ${serverConfig.PORT} and running in ${serverConfig.NODE_ENV} mode`);
});

const app = require("./app");
const connectToDB = require("./config/dbConfig");

const fastify = require("fastify")({ logger: true });

const serverConfig = require("./config/serverConfig");

fastify.register(app);

const start = async () => {
  try {
    await connectToDB();
    await fastify.listen({ port: serverConfig.PORT });
    console.log(
      `Server up at port ${serverConfig.PORT} and running in ${serverConfig.NODE_ENV} mode`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

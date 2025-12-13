const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  MONGODB_URI: process.env.MONGODB_URI,
  PROBLEM_SERVICE_BASE_URL: process.env.PROBLEM_SERVICE_BASE_URL,
};

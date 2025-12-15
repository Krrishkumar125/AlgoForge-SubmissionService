const { Queue } = require("bullmq");

const redisConnection = require("../config/redisConfig.js");

module.exports = new Queue("EvaluationQueue", { connection: redisConnection });

const { Worker } = require("bullmq");

const redisConnection = require("../config/redisConfig");
const { postEvaluationDetails } = require("../apis/socketApi");

function evaluationWorker(queueName) {
  new Worker(
    queueName,
    async (job) => {
      if (job.name === "EvaluationJob") {
          console.log(job.data);
          postEvaluationDetails(job.data.userId, job.data);
          
      }
    },
    { connection: redisConnection }
  );
}

module.exports = evaluationWorker;

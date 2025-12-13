const axiosInstance = require("../config/axiosInstance");
const { PROBLEM_SERVICE_BASE_URL } = require("../config/serverConfig");

const PROBLEM_SERVICE_API_URL = `${PROBLEM_SERVICE_BASE_URL}/api/v1`;

async function fetchProblemDetails(problemId) {
  try {
    const uri = PROBLEM_SERVICE_API_URL + `/problems/${problemId}`;
    const response = await axiosInstance.get(uri);
    console.log("Fetched problem details:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching problem details:", error);
  }
}

module.exports = {
  fetchProblemDetails,
};

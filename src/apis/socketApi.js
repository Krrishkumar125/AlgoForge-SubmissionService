const axiosInstance = require("../config/axiosInstance");
const { SOCKET_SERVICE_BASE_URL } = require("../config/serverConfig");

const SOCKET_SERVICE_API_URL = `${SOCKET_SERVICE_BASE_URL}`;

async function postEvaluationDetails(userId, payload) {
  try {
    const uri = SOCKET_SERVICE_API_URL + `/sendPayload`;
    const response = await axiosInstance.post(uri, {
      userId,
      payload,
    });
    console.log(response.data);
    return response;
  } catch (error) {
    console.log("Error fetching problem details:", error);
  }
}

module.exports = {
  postEvaluationDetails,
};

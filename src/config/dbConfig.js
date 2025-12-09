const mongoose = require('mongoose');
const { MONGODB_URI, NODE_ENV } = require('./serverConfig');

async function connectToDB() {
    try {
        if (NODE_ENV === "development") {
            await mongoose.connect(MONGODB_URI);
        }
    } catch (error) {
        console.log("Unable to connect to the DB server");
        console.log(error);
    }
}

module.exports = connectToDB;
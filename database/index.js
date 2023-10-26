const mongoose = require("mongoose");
const fs = require("fs");

const database = async () => {

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB has been connected!"))
    .catch((error) => {
          console.error("Error connecting to MongoDB:", error.message);
      throw error;

    })
};

module.exports = database;

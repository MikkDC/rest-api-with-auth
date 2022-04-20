// Do this first. Ensure you have a connection to work with
// before doing anything else.
require("dotenv").config();
const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Server Online and Connected");
    } catch (error) {
        console.log(error);
    }
};

connection();

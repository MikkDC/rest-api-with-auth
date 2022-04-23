require("./db/connection");
const express = require("express");
// cors stands for Cross Origin Resource Sharing
// Allows 2 apps located in different network locations
// to communicate with each other securely
const cors = require("cors");
const userRouter = require("./user/userRoutes");
const app = express();
const port = process.env.PORT || 5001;

// Allows app to interpret JSON data as Javascript objects
app.use(express.json());
app.use(cors()); /* Allows use of previously mentioned cors */

// User routes. It is placed below cors and express so that the 
// routes can make use of JSON and cors
app.use(userRouter);

// runs express application
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

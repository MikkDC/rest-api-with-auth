require("./connection");
const express = require("express");
const userRouter = require("./user/userRoutes");
const app = express();
const port = process.env.HTTP_PORT;

// handle JSON data
app.use(express.json());

// user routes
app.use(userRouter);

// run express application
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

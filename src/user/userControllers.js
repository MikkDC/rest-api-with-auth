const jwt = require("jsonwebtoken");
const User = require("./userModel");
const bcrypt = require("bcryptjs")

// (CREATE) - Registers new user with username and password
exports.regUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        // creates a JWT (json web token) using the _id value created by MongoDB
        // and then hash it using the SECRET_KEY in the .env as the source
        const token = await jwt.sign(
            { _id: newUser._id },
            process.env.SECRET_KEY
        );
        res.status(200).send({ user: newUser, token: token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

// (READ) - Finds all users when using a GET with just /user and nothing in body
// or just one user by entering a username into the body 
// for example - "username" : "mikk" will find a user name mikk, if one exists
// if not "user": null is returned in the request
exports.findUser = async (req, res) => {
    try {
        if (req.body.username) {
            const getUser = await User.findOne({ username: req.body.username });
            res.status(200).send({ user: getUser });
        } else {
            const getUser = await User.find({});
            res.status(200).send({ user: getUser });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

// (UPDATE) Allow a user to change username
// Allows users already in DB to be updated
// but does nothing if user is not in DB to begin with
exports.updateUser = async (req, res) => {
    try {
        if (req.body.username) {
            const amendUser = await User.updateOne(
                { username: req.body.username },
                { $set: { username: req.body.newusername } }
            );
            res.status(200).send({
                amendUser
            });
        } else {
            res.status(400).send({ message: "Invalid request" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

// (DELETE) - removes a user from the database
// Ideally, this would also check that the password was entered correctly
// but this just provides a way of quickly deleting users
// for demonstration purposes only
exports.deleteUser = async (req, res) => {
    try {
        const eraseUser = await User.deleteOne({
            username: req.body.username,
        });
                
        res.status(200).send({
            eraseUser,
            message: `User ${req.body.username} has been Deleted`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

// Logging a user in.
exports.login = async (req, res) => {
    try {
        const findUser = await User.findOne({ username: req.body.username });
        if (findUser) {
            const checkPassword = await bcrypt.compare(
                req.body.password,
                findUser.password /* compares users hashed pass stored in DB
				with one entered (bcrypt hashes entered password first)*/
            );
            if (checkPassword) {
                res.status(200).send({
                    message: `${req.body.username}, you have successfully logged in!`,
                });
            } else {
                res.status(400).send({
                    message: "Password entered incorrectly. Please try again.",
                });
            }
        } else {
            res.status(400).send({ message: "User does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

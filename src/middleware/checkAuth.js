const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../user/userModel");
// Middleware requires the next method. .next tells
// the rest api when its done with the function
// and if the middleware was successful
const hashPassword = async (req, res, next) => {
    try {
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(saltRounds);
        req.body.password = await bcrypt.hash(
            req.body.password,
            salt
        ); /* hashes the password inputted into a random string and saves it into the DB */
        next(); /* remember to include next, otherwise the program will get stuck within this function */
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

const decryptPassword = async (req, res, next) => {
    try {
        const infoUser = await User.findOne({
            username: req.body.username,
        }); /* finds a user and stores it in the info User variable */
        if (await bcrypt.compare(req.body.password, infoUser.password)) {
            req.user =
                infoUser; /* compares the found users password in the DB with the one inputted (after hashing) */
            next();
        } else {
            res.status(500).send({
                message: "Incorrect credentials. Please try again.",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

const tokenCheck = async (req, res, next) => {
    try {
        // the first line removes the default auth token contained in the header
        // and replaces it with an empty string
        const token = req.header("Authorization").replace("Bearer ", "");

        // Verify takes 2 items - the hashed token and the secret with which it
        // was hashed (SECRET_KEY in this case) and converts it back to the users _id
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findOne({ _id: decoded._id });
        if (req.user) {
            next();
        } else {
            throw new Error("Invalid token");
        }
        // Commented out alternative code from prior weeks
        // const user = await User.findById(decoded._id);
        // req.user = user;
        // next();
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
};

module.exports = {
    hashPassword,
    decryptPassword,
    tokenCheck,
};

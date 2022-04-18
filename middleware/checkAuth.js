const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../user/userModel");

const hashPassword = async (req, res, next) => {
	try {
        const saltRounds = parseInt(process.env.SALT_ROUNDS)
		const salt = await bcrypt.genSalt(saltRounds);
		req.body.password = await bcrypt.hash(req.body.password, salt);
		next();
	} catch (error) {
		console.log(error);
		res.status(500).send({ err: error.message });
	}
};

const decryptPassword = async (req, res, next) => {
	try {
		const infoUser = await User.findOne({ username: req.body.username });
		if (await bcrypt.compare(req.body.password, infoUser.password)) {
			req.user = infoUser;
			next();
		} else {
			res.status(500).send({
				message: "Incorrect password. Please try again.",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ err: error.message });
	}
};

const tokenCheck = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = await jwt.verify(token, process.env.SECRET);
		const user = await User.findById(decoded._id);
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		res.status(500).send({ err: error.message });
	}
};

module.exports = {
    hashPassword,
    decryptPassword,
    tokenCheck
}
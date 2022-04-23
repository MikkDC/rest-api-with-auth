const mongoose = require("mongoose");
// Capital S is used for .Schema because it is a CLASS
// within mongoose
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});
// Mongoose model method needs 2 argumants:
// Capitalised name and the schema it uses
const User = mongoose.model("User", userSchema);

module.exports = User;
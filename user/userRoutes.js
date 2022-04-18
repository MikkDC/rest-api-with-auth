const { Router } = require("express");
const { hashPassword, decryptPassword, tokenCheck } = require("../middleware/checkAuth");
const {
	regUser,
	findUser,
	updateUser,
	deleteUser,
	login,
} = require("./userControllers");
const userRouter = Router();

// CRUD routes
userRouter.post("/user", hashPassword, regUser);
userRouter.get("/user", findUser);
userRouter.put("/user", updateUser);
userRouter.delete("/user", deleteUser);

userRouter.post("/login", decryptPassword, login);

userRouter.get("/token", tokenCheck, login);

module.exports = userRouter;
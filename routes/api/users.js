const express = require("express");
const {
  signupHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
} = require("../../users/controller");
const { userValidationMiddleware } = require("../../users/validators");
const { authMiddleware } = require("../../auth/authMiddleware");
const usersRouter = express.Router();

usersRouter.post("/signup", userValidationMiddleware, signupHandler);
usersRouter.post("/login", userValidationMiddleware, loginHandler);
usersRouter.get("/logout", authMiddleware, logoutHandler);
usersRouter.get("/secret", authMiddleware, (req, res) =>
  res.status(200).json({ message: "Authorized" })
);
usersRouter.get("/current", authMiddleware, currentHandler);

module.exports = usersRouter;

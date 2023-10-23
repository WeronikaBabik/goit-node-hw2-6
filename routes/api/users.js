const express = require("express");

const {
  signupHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
  avatarHandler,
  getAllUsers,
  avatar,
  verifyHandler,
  resendVerification,
} = require("../../users/controller");
const { userValidationMiddleware } = require("../../users/validators");
const { authMiddleware } = require("../../auth/authMiddleware");
const upload = require("../../auth/authAvatar");
const usersRouter = express.Router();

usersRouter.post("/signup", userValidationMiddleware, signupHandler);
usersRouter.post("/login", userValidationMiddleware, loginHandler);
usersRouter.get("/logout", authMiddleware, logoutHandler);
usersRouter.get("/secret", authMiddleware, (req, res) =>
  res.status(200).json({ message: "Authorized" })
);
usersRouter.get("/current", authMiddleware, currentHandler);
usersRouter.get("/", getAllUsers);
usersRouter.get("/verify/:verificationToken", verifyHandler);
usersRouter.post("/verify", resendVerification);
usersRouter.post("/", avatar);
usersRouter.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  avatarHandler
);

module.exports = usersRouter;

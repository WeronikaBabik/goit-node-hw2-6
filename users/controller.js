const { generateAccessToken } = require("../auth/service");
const { DuplicatedKeyError } = require("../errors");
const { createUser, getUser, updateUser } = require("./dao");
const { User } = require("./model");

const signupHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await createUser({ email, password });
    return res.status(201).send({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    const { message } = error;
    if (error instanceof DuplicatedKeyError) {
      res.status(409).json({ message });
    }
    return next();
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const user = await getUser(req.body.email);
    if (!user || !(await user.validatePassword(req.body.password))) {
      res.status(401).json({ message: "Email or password is wrong" });
    }
    const userPayload = {
      email: user.email,
      subscription: user.subscription,
    };
    const token = generateAccessToken(userPayload);
    await updateUser(user.email, { token });
    res.status(200).json({ token, user: userPayload });
  } catch (error) {
    return next(error);
  }
};

const logoutHandler = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({ message: "No Content" });
  } catch (error) {
    return next(error);
  }
};

const currentHandler = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ user: { email, subscription } });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
};

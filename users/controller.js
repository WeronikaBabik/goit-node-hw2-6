const { generateAccessToken } = require("../auth/service");
const { DuplicatedKeyError } = require("../errors");
const { createUser, getUser, updateUser } = require("./dao");
const { User } = require("./model");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const mimetypes = require("mime-types");

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

const avatar = async (req, res) => {
  try {
    const { email } = req.user;
    const avatar = gravatar.url(
      `${email}@gmail.com`,
      { default: "identicon" },
      true
    );
    const user = await User.create({ email, avatar });

    return res.status(201).send({ user });
  } catch (e) {
    return res.status(500).send();
  }
};

const avatarHandler = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload } = req.file;
    const filename = `${_id}_${Date.now()}.${mimetypes.extension(
      req.file.mimetype
    )}`;
    const result = path.join(
      path.join(__dirname, "../", "public", "avatars"),
      filename
    );
    const avatarImage = await Jimp.read(req.file.path);
    const resizedAvatarImage = avatarImage.resize(250, 250);
    await resizedAvatarImage.writeAsync(req.file.path);
    await fs.rename(tempUpload, path.join(result));
    const avatarURL = `http://localhost:3000/avatars/${filename}`;
    await User.findByIdAndUpdate(_id, { avatar: avatarURL }, { new: true });
    res.status(200).json({ avatarURL });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({ users });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
  avatar,
  avatarHandler,
  getAllUsers,
};

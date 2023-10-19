const { UnknownDatabaseError, DuplicatedKeyError } = require("../errors");
const { User } = require("./model");

const createUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const [[key, value]] = Object.entries(error.keyValue);
      throw new DuplicatedKeyError(key, value);
    }
    throw new UnknownDatabaseError();
  }
};

const getUser = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new UnknownDatabaseError();
  }
};

const updateUser = async (email, userData) => {
  try {
    return await User.findOneAndUpdate({ email }, userData);
  } catch (error) {
    console.error(error);
    throw new UnknownDatabaseError();
  }
};

module.exports = { createUser, getUser, updateUser };

const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const contactValidationMiddleware = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
const addContactValidation = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});
const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new Error(400, `${id} is not valid`);
  }
  next();
};

module.exports = {
  contactValidationMiddleware,
  isValidId,
  addContactValidation,
};

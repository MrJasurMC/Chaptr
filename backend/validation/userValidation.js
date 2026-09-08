const Joi = require('joi');
function ValidateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').optional()
  });
  return schema.validate(user);
}
function ValidateUserUpdate(user) {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('user', 'admin').optional()
  });
  return schema.validate(user);
}
function ValidateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(user);
}
module.exports = {
  ValidateUser,
  ValidateUserUpdate,
  ValidateLogin
};

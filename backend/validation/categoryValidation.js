const Joi = require('joi');
function ValidateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('').optional()
  });
  return schema.validate(category);
}
function ValidateCategoryUpdate(category) {
  const schema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().allow('').optional()
  });
  return schema.validate(category);
}
module.exports = {
  ValidateCategory,
  ValidateCategoryUpdate
};

const Joi = require('joi');
function ValidatePage(page) {
  const schema = Joi.object({
    book_id: Joi.number().integer().required(),
    page_number: Joi.number().integer().required(),
    content: Joi.string().required()
  });
  return schema.validate(page);
}
function ValidatePageUpdate(page) {
  const schema = Joi.object({
    book_id: Joi.number().integer().optional(),
    page_number: Joi.number().integer().optional(),
    content: Joi.string().optional()
  });
  return schema.validate(page);
}
module.exports = {
  ValidatePage,
  ValidatePageUpdate
};

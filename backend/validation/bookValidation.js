const Joi = require('joi');
function ValidateBook(book) {
  const schema = Joi.object({
    category_id: Joi.number().integer().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    cover_image: Joi.string().allow('').optional(),
    total_pages: Joi.number().integer().optional(),
    free_pages: Joi.number().integer().optional(),
    price: Joi.number().precision(2).required()
  });
  return schema.validate(book);
}
function ValidateBookUpdate(book) {
  const schema = Joi.object({
    category_id: Joi.number().integer().optional(),
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
    cover_image: Joi.string().allow('').optional(),
    total_pages: Joi.number().integer().optional(),
    free_pages: Joi.number().integer().optional(),
    price: Joi.number().precision(2).optional()
  });
  return schema.validate(book);
}
module.exports = {
  ValidateBook,
  ValidateBookUpdate
};

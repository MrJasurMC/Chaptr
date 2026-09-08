const Joi = require('joi');
function ValidateReview(review) {
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('').optional()
  });
  return schema.validate(review);
}
function ValidateReviewUpdate(review) {
  const schema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).optional(),
    comment: Joi.string().allow('').optional()
  });
  return schema.validate(review);
}
module.exports = {
  ValidateReview,
  ValidateReviewUpdate
};

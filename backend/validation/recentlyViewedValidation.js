const Joi = require('joi');
function ValidateRecentlyViewed(entry) {
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required()
  });
  return schema.validate(entry);
}
module.exports = {
  ValidateRecentlyViewed
};

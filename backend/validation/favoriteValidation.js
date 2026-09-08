const Joi = require('joi');
function ValidateFavorite(favorite) {
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required()
  });
  return schema.validate(favorite);
}
module.exports = {
  ValidateFavorite
};

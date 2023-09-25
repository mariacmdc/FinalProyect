const Joi = require('joi');
const newUserSchema = Joi.object({
  Email: Joi.string().email().min(4).max(100).required(),
  name: Joi.string().min(4).max(100).required(),
  Password: Joi.string().min(4).max(50).required(),
});
module.exports = newUserSchema;

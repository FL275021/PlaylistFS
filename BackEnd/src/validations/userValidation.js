const Joi = require('joi');
 
exports.updateMeSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
}).min(1);
 
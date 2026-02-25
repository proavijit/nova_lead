const Joi = require('joi');

const prospectSearchSchema = Joi.object({
    prompt: Joi.string().required().min(5).max(500),
    page: Joi.number().integer().min(1).default(1),
    size: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
    prospectSearchSchema
};

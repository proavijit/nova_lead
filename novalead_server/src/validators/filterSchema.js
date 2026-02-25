const Joi = require('joi');

const valuesObj = Joi.object({ values: Joi.array().items(Joi.string()).min(1) });

const filterSchema = Joi.object({
    mode: Joi.string().valid('full', 'enrich').default('full'),
    size: Joi.number().integer().min(1).max(100).default(10),
    page_size: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).default(1),
    filters: Joi.object({
        country_code: valuesObj,
        company_size: valuesObj,
        linkedin_category: valuesObj,
        job_level: valuesObj,
        job_department: valuesObj
    }).required()
});

function validateFilter(data) {
    return filterSchema.validate(data, { allowUnknown: false });
}

module.exports = { validateFilter };

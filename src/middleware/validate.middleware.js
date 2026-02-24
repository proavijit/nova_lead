const { AppError } = require('../utils/apiError');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    try {
      const { value, error } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
      });

      if (error) {
        const message = error.details
          ? error.details.map((d) => d.message).join(', ')
          : error.message;
        return next(new AppError(message, 400));
      }

      req[property] = value;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;

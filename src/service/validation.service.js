const Joi = require("joi");
const xss = require("xss");
const logger = require("../config/winston.config"); 

class ValidationService {
  validateInput(username, password) {
    username = xss(username);
    password = xss(password);

    const schema = Joi.object({
      username: Joi.string()
        .pattern(/^[A-Za-z0-9_]+$/)
        .required()
        .messages({
          "string.empty": "username cant be empty",
          "string.pattern.base": "username should only contain letters, numbers, and underscores",
        }),
      password: Joi.string().min(6).required().messages({
        "string.empty": "password cant be empty",
        "string.min": "password should be at least 6 characters long",
      }),
    });

    const { error } = schema.validate({ username, password });
    if (error) {
      logger.error(`Validation Error: ${error.details[0].message}`, {
        username, 
        password,
      });
      throw new Error(error.details[0].message);
    }

    logger.info(`Validation successful for username: ${username}`);
    return true;
  }
}

module.exports = new ValidationService();

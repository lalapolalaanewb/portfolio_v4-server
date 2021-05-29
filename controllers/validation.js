/** Dependencies */
// Hapi Joi
const joi = require('@hapi/joi')

/** Validation Functions Handler */
// Register validation
exports.registerValidation = data => {
  // validation schema
  const schema = joi.object({
    email: joi
      .string()
      .required()
      .email(),
    password: joi
      .string()
      .min(6).max(72, 'utf8')
      .required(),
    passwordConfirm: joi
      .valid(joi.ref('password'))
      .required(),
    firstName: joi
      .string()
      .required(),
    lastName: joi
      .string()
      .required(),
    nickName: joi
      .string()
      .allow('')
  })
  
  return schema.validate(data)
}
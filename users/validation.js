import Joi from "joi";

const userEnum = ["RESTAURANT", "USER", "ADMIN"];
export const userSignUpValidation = ({
  email,
  first_name,
  last_name,
  phone_number,
  type,
  password,
}) => {
  const joiSchema = Joi.object().keys({
    email: Joi.string().lowercase().email().required().messages({
      "string.base": `email should be a type of String`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `Please enter Correct email`,
      "any.required": `email is required.`,
    }),
    first_name: Joi.string().required().messages({
      "string.base": `first_name should be a type of String`,
      "string.empty": `first_name cannot be an empty field`,
      "any.required": `first_name is required.`,
    }),
    last_name: Joi.string().required().messages({
      "string.base": `last_name should be a type of String`,
      "string.empty": `last_name cannot be an empty field`,
      "any.required": `last_name is required.`,
    }),
    type: Joi.string()
      .required()
      .valid(...userEnum)
      .messages({
        "string.base": `type should be a type of String`,
        "string.empty": `type cannot be an empty field`,
        "any.required": `type is required.`,
        "any.only": `Invalid user type. Allowed values: ${userEnum.join(", ")}`,
      }),
    phone_number: Joi.string().required().messages({
      "string.base": `phone_number should be a type of String`,
      "string.empty": `phone_number cannot be an empty field`,
      "any.required": `phone_number is required.`,
    }),
    password: Joi.string().required().messages({
      "string.base": `password should be a type of Text`,
      "string.empty": `password cannot be an empty field`,
      "any.required": `password is required.`,
    }),
  });
  const { value, error } = joiSchema.validate(
    { email, first_name, last_name, phone_number, type, password },
    { escapeHtml: true }
  );
  return { value, error };
};

export const loginValidation = ({ email, password, type }) => {
  const joiSchema = Joi.object().keys({
    email: Joi.string().lowercase().email().required().messages({
      "string.base": `email should be a type of String`,
      "string.empty": `email cannot be an empty field`,
      "string.email": `Please enter Correct email`,
      "any.required": `email is required.`,
    }),
    type: Joi.string()
      .required()
      .valid(...userEnum)
      .messages({
        "string.base": `type should be a type of String`,
        "string.empty": `type cannot be an empty field`,
        "any.required": `type is required.`,
        "any.only": `Invalid user type. Allowed values: ${userEnum.join(", ")}`,
      }),
    password: Joi.string().required().messages({
      "string.base": `password should be a type of Text`,
      "string.empty": `password cannot be an empty field`,
      "any.required": `password is required.`,
    }),
  });
  const { value, error } = joiSchema.validate(
    { email, password, type },
    { escapeHtml: true }
  );
  return { value, error };
};

'use strict';

const Joi = require('joi');

const createDeviceSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = createDeviceSchema;
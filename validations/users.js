'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    email: Joi.string()
      .label('Email')
      .required()
      .trim(),

    password: Joi.string()
      .label('Password')
      .min(8)
      .required()
      .trim()
  }
};

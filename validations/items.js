'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string()
      .label('Title')
      .required()
      .trim(),

    description: Joi.string()
      .label('Description')
      .required()
      .trim(),

    imagePath: Joi.string()
      .label('Image Path')
      .required()
      .trim()
  }
};

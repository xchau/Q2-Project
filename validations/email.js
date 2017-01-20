'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    borrowName: Joi.string()
      .label('Borrower name')
      .required()
      .trim(),

    borrowEmail: Joi.string()
      .label('Borrower email')
      .email()
      .trim(),

    ownerName: Joi.string()
      .label('Owner name')
      .required()
      .trim(),

    ownerEmail: Joi.string()
      .label('Owner email')
      .required()
      .email()
      .trim(),

    itemName: Joi.string()
      .label('Item name')
      .required()
      .trim(),

    emailText: Joi.string()
      .label('Email text')
      .required()
      .trim()
  }
};

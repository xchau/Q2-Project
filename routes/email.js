'use strict';

const boom = require('boom');
const express = require('express');
const ev = require('express-validation');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const request = require('superagent');
const validation = require('../validations/items');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.claim = payload;

    next();
  });
};

// EMAIL
router.get('/email', (req, res, next) => {
  request
  .post('https://api.mailgun.net/v3/sandboxdf7accc8fa234d548965274865018aea.mailgun.org/messages')
  .auth('api', 'key-7649f5fb6a469ac3718ee7d6eb14c3ba')
  .field('from', 'NearBuy <postmaster@sandboxdf7accc8fa234d548965274865018aea.mailgun.org>')
  .field('to', 'Debbie Gibson <electricyouth411@gmail.com>')
  .field('subject', 'Hello, Scott')
  .field('text', 'What the what')
  .end((err, result) => {
    console.log(err);
    res.send('What the what');
  });
});

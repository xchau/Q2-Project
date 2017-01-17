'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const ev = require('express-validation');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const validation = require('../validations/users');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new cap
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

router.get('/dashboard', authorize, (req, res, next) => {
  const { userId } = req.claim;

  knex('items')
    .where('user_id', userId)
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.log('something');
      next(err);
    });
});

module.exports = router;

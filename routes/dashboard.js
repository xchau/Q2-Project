'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
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
      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

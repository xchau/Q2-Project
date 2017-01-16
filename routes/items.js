'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
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

router.get('/items', (req, res, next) => {
  knex('items')
    .orderBy('title')
    .then((items) => {
      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/items/search', (req, res, next) => {
  const keyword = req.query.q;

  if (!keyword) {
    return next(boom.create(400, 'Please enter a valid keyword'));
  }

  knex('items')
    .where('title', 'ILIKE', keyword)
    .orderBy('title', 'ASC')
    .then((items) => {
      if (!items) {
        throw next();
      }

      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

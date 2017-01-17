'use strict';

const boom = require('boom');
const express = require('express');
const ev = require('express-validation');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
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

router.get('/items', (req, res, next) => {
  knex('items')
    .select('items.id', 'items.image_path', 'items.title', 'items.created_at', 'items.updated_at', 'items.description', 'users.name')
    .innerJoin('users', 'users.id', 'items.user_id')
    .orderBy('items.id', 'DESC')
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
    .where('title', 'ILIKE', `%${keyword}%`)
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

router.post('/items', ev(validation), authorize, (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const image = req.body.imagePath;

  knex('items').insert(decamelizeKeys({
    userId: req.claim.userId,
    title: title,
    description: description,
    imagePath: image
  }), '*')
  .then((items) => {
    if (!items.length) {
      return next();
    }
    const item = items[0];

    res.send(item);
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;

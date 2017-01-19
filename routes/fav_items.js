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
    // QQQQ: setting req.claim to payload but not returning it? is this a
    // global thing?
    req.claim = payload;

    next();
  });
};

// I DONT THINK WE NEED THIS ONE
router.get('/fav_items/:id', authorize, (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  console.log(id);

  knex('fav_items')
    .where('fav_items.user_fav_id', id)
    .orderBy('id', 'ASC')
    .then((favItems) => {
      res.send(camelizeKeys(favItems));
    })
    .catch((err) => {
      next(err);
    });
});

// router.post('/fav_items', authorize, (req, res, next) => {
//
// });
//
// router.delete('/fav_items', authorize, (req, res, next) => {
//
// });

module.exports = router;

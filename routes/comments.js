'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

// const authorize = function(req, res, next) {
//   jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
//     if (err) {
//       return next(boom.create(401, 'Unauthorized'));
//     }
//
//     req.claim = payload;
//
//     next();
//   });
// };

router.get('/comments/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('comments')
    .innerJoin('users', 'users.id', 'comments.users_id')
    .where('comments.item_id', id)
    .orderBy('comments.updated_at', 'DESC')
    .then((comments) => {
      res.send(camelizeKeys(comments));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

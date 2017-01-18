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

router.post('/requests', ev(validation), authorize, (req, res, next) => {
  const reqBody = camelizeKeys(req.body);
  const favorite = {
    itemId: reqBody.item_id,
    userId: reqBody.user_id,
    borrowId: reqBody.borrow_id
  };

  knex('favorites').insert(decamelizeKeys(favorite), '*')
    .then((favorites) => {
      if (!favorites.length) {
        return next();
      }
      const favoriteInserted = favorites[0];

      res.send(favoriteInserted);
    })
    .catch((err) => {
      next(err);
    });
});

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

router.get('/requests/:id', authorize, (req, res, next) => {

});

router.post('/requests', ev(validation), authorize, (req, res, next) => {
  const reqBody = decamelizeKeys(req.body);
  const favorite = {
    itemId: reqBody.item_id,
    userId: reqBody.user_id,
    borrowId: reqBody.borrow_id
  };

  knex('requests').insert(decamelizeKeys(favorite), '*')
    .then((requests) => {
      if (!requests.length) {
        return next();
      }
      const requestInserted = requests[0];

      res.send(requestInserted);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

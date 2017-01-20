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
  knex('requests')
    .select('items.title', 'users.name', 'items.id')
    .innerJoin('users', 'requests.borrow_id', 'users.id')
    .innerJoin('items', 'requests.item_id', 'items.id')
    .where('requests.user_id', req.params.id)
    .orderBy('items.title')
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/requests', ev(validation), authorize, (req, res, next) => {
  const reqBody = decamelizeKeys(req.body);
  const userInfo = {};
  const favorite = {
    itemId: reqBody.item_id,
    userId: reqBody.user_id,
    borrowId: reqBody.borrow_id
  };

  knex('users')
    .where('id', favorite.userId)
    .then((owners) => {
      userInfo.ownerName = owners[0].name;
      userInfo.ownerEmail = owners[0].email;

      return knex('users')
        .where('id', favorite.borrowId);
    })
    .then((borrowers) => {
      userInfo.borrowName = borrowers[0].name;
      userInfo.borrowEmail = borrowers[0].email;

      return knex('items')
        .where('id', favorite.itemId);
    })
    .then((items) => {
      userInfo.itemName = items[0].title;

      return knex('requests').insert(decamelizeKeys(favorite), '*');
    })
    .then((requests) => {
      if (!requests.length) {
        return next();
      }

      const requestInserted = requests[0];

      userInfo.requestInserted = requestInserted;

      res.send(userInfo);
    })
    .catch((err) => {
      next(err);
    });

  // knex('requests').insert(decamelizeKeys(favorite), '*')
  //   .then((requests) => {
  //     if (!requests.length) {
  //       return next();
  //     }
  //
  //     const requestInserted = requests[0];
  //
  //     userInfo.requestInserted = requestInserted;
  //
  //     res.send(requestInserted);
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
});

router.delete('/requests/:id', authorize, (req, res, next) => {
  knex('requests')
    .del('*')
    .where('item_id', req.params.id)
    .then((favorites) => {
      const favorite = favorites[0];

      delete favorite.id;
      res.send(favorite);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

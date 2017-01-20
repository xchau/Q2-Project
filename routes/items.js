
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

router.get('/items', authorize, (req, res, next) => {
  knex('items')
    .select('items.id', 'items.image_path', 'items.title', 'items.created_at', 'items.updated_at', 'items.description', 'items.requested_at', 'users.name', 'users.id AS owner_id')
    .innerJoin('users', 'users.id', 'items.user_id')
    .orderBy('items.id', 'DESC')
    .then((items) => {
      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/items/search', authorize, (req, res, next) => {
  const keyword = req.query.q;

  if (!keyword) {
    return next(boom.create(400, 'Please enter a valid keyword'));
  }

  knex('items')
    .select('items.id', 'items.image_path', 'items.title', 'items.created_at', 'items.updated_at', 'items.description', 'items.requested_at', 'users.name', 'users.id AS owner_id')
    .innerJoin('users', 'users.id', 'items.user_id')
    .where('title', 'ILIKE', `%${keyword}%`)
    .orderBy('items.id', 'DESC')
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

router.get('/items/:id', (req, res, next) => {
  if (!Number(req.params.id)) {
    return next();
  }

  knex('items')
    .where('id', req.params.id)
    .first()
    .then((item) => {
      if (!item) {
        return next();
      }
      res.send(item);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/items', ev(validation), authorize, (req, res, next) => {
  const userId = req.body.userId;
  const title = req.body.title;
  const description = req.body.description;
  const image = req.body.imagePath;

  console.log(req.claim.userId, userId);
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

    res.send(camelizeKeys(item));
  })
  .catch((err) => {
    next(err);
  });
});

router.patch('/items', authorize, (req, res, next) => {
const itemId = Number.parseInt(req.body.itemId);

  if (!itemId || Number.isNaN(itemId)) {
    return next();
  }

  knex('items')
    .where('items.id', itemId)
    .first()
    .then((item) => {
      if (!item) {
        throw boom.create(400, 'PATCH: Item does not exist')
      }

      const requestedAt = { requested_at: knex.fn.now() };

      return knex('items')
        .update(requestedAt, '*')
        .where('items.id', itemId);
    })
    .then((items) => {
      res.send(camelizeKeys(items[0]));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/items/:id', (req, res, next) => {
  const userInfo = {};

  if (!Number(req.params.id)) {
    return next();
  }

  knex('requests')
    .innerJoin('users', 'requests.borrow_id', 'users.id')
    .where('item_id', req.params.id)
    .then((users) => {
      const user = users[0];

      userInfo.borrowName = user.name;
      userInfo.borrowEmail = user.email;

      return knex('items')
        .innerJoin('users', 'items.user_id', 'users.id')
        .where('items.id', req.params.id);
    })
    .then((owners) => {
      const owner = owners[0];

      userInfo.ownerName = owner.name;
      userInfo.ownerEmail = owner.email;

      return knex('items')
        .del('*')
        .where('items.id', req.params.id);
    })
    .then((items) => {
      const item = items[0];

      delete item.id;
      userInfo.itemName = item.title;
      res.send(userInfo);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

'use strict';

const boom = require('boom');
const express = require('express');
const ev = require('express-validation');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const request = require('superagent');
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

// EMAIL
// router.get('/requests/email', (req, res, next) => {
//   request
//   .post('https://api.mailgun.net/v3/sandboxdf7accc8fa234d548965274865018aea.mailgun.org/messages')
//   .auth('api', 'key-7649f5fb6a469ac3718ee7d6eb14c3ba')
//   .field('from', 'NearBuy <postmaster@sandboxdf7accc8fa234d548965274865018aea.mailgun.org>')
//   .field('to', 'Debbie Gibson <electricyouth411@gmail.com>')
//   .field('subject', 'Hello, Scott')
//   .field('text', 'What the what')
//   .end((err, result) => {
//     console.log(err);
//     res.send('What the what');
//   });
// });

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
      return knex('users')
        .where('id', favorite.borrow_id);
    })
    .then((borrowers) => {
      delete borrowers[0].h_pw;
      res.send(borrowers[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// router.delete('/requests/:id', authorize, (req, res, next) => {
//   knex('requests')
//     .del('*')
//     .where('item_id', req.params.id)
//     .then((favorites) => {
//       const favorite = favorites[0];
//
//       delete favorite.id;
//       res.send(favorite);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

module.exports = router;

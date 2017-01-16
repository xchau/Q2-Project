'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  const newEmail = req.body.email;

    knex('users')
      .where('email', newEmail)
      .then((users) => {
        if (users.length) {
          throw boom.badRequest('Email already exists');
        }

        return bcrypt.hash(req.body.password, 12);
      })
      .then((hashedPassword) => {
        return knex('users').insert(decamelizeKeys({
          name: req.body.name,
          email: req.body.email,
          hPw: hashedPassword
        }), '*');
      })
      .then((users) => {
        const user = camelizeKeys(users[0]);

        delete user.hPw;
        res.send(user);
      })
      .catch((err) => {
        next(err);
      });
});

module.exports = router;

// user.js validates request body (email etc)
// because if already in system then should error
// hash password insert to database
// create cookie and attach to response
// send back to index.js

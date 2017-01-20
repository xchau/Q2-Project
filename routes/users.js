'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const ev = require('express-validation');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const validation = require('../validations/users');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new cap
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

router.get('/users/:id', (req, res, next) => {
  if (!Number(req.params.id)) {
    return next();
  }
  knex('users')
    .where('id', req.params.id)
    .then((users) => {
      if (!users.length) {
        return next();
      }
      const user = users[0];

      delete user.h_pw;
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/users', ev(validation), (req, res, next) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;

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

        const claim = { userId: user.id };
        const token = jwt.sign(claim, process.env.JWT_KEY, {           expiresIn: '7 days'
        });

        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          secure: router.get('env') === 'production'
        });

        delete user.hPw;
        res.send(user);
      })
      .catch((err) => {
        next(err);
      });
});

router.patch('/users/:id', authorize, (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  const imagePath = req.body.userImagePath;
  const update = { userImagePath: imagePath };

  knex('users')
    .update(decamelizeKeys(update), '*')
    .where('id', req.params.id)
    .then((users) => {
      delete users[0].h_pw;
      res.send(camelizeKeys(users[0]));
    })
});

module.exports = router;

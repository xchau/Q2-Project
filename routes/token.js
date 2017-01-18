'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const ev = require('express-validation');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const validation = require('../validations/token');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/token', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      // handle this error
      return res.send(false);
    }
    res.claim = payload;

    res.send(res.claim);
  });
});

router.post('/token', ev(validation), (req, res, next) => {
  const { email, password } = req.body;

  let user;

  knex('users')
    .where('email', email)
    .first()
    .then((result) => {
      if (!result) {
        throw boom.create(400, 'Invalid email or password');
      }

      user = camelizeKeys(result);

      return bcrypt.compare(password, user.hPw);
    })
    .then(() => {
      const claim = { userId: user.id };
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: router.get('env') === 'production'
      });

      delete user.hPw;

      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Invalid email or password');
    })
    .catch((err) => {
      next(err);
    });
});

// for logout
router.delete('/token', (req, res) => {
  res.clearCookie('token');
  res.end();
});

module.exports = router;

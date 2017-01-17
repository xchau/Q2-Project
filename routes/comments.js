'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/comments', (req, res, next) => {
  knex('comments')
    .orderBy('id', 'ASC')
    .then((comments) => {
      res.send(camelizeKeys(comments));
    })
    .catch((err) => {
      next(err);
    });
});

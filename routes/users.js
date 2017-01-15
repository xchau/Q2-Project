'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex == require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new cap
const router = express.Router();


// user.js validates request body (email etc)
// because if already in system then should error
// hash password insert to database
// create cookie and attach to response
// send back to index.js

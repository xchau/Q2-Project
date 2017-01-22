'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

app.disable('x-powered-by');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('short'));

const path = require('path');

app.use(express.static(path.join('public')));

const users = require('./routes/users');
const items = require('./routes/items');
const favItems = require('./routes/fav_items');
const comments = require('./routes/comments');
const token = require('./routes/token');
// const dashboard = require('./routes/dashboard');
const requests = require('./routes/requests');
const email = require('./routes/email');

app.use(users);
app.use(items);
app.use(favItems);
app.use(comments);
app.use(token);
// app.use(dashboard);
app.use(requests);
app.use(email);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, _next) => {
  // console.log(err);
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(err.status || 500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {

  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}...`);
});

module.exports = app;

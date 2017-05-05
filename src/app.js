import express from 'express';
const json = require('body-parser').json;
import { resolve } from 'path';
import pg from 'pg';
const Pool = require('pg-pool');

import fallback from 'express-history-api-fallback';

import config from '../config'

const apiRouter = new express.Router();
const authRouter = new express.Router();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const root = resolve(process.cwd(), config.get('STATIC_PATH'));
const app = express();

const configuration = {
  user: 'reditscratch', //env var: PGUSER
  database: 'reditscratch', //env var: PGDATABASE
  password: 'reditscratch', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
};

export const pool = new Pool(configuration);

app.use(json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.use('/api', apiRoutes(apiRouter));
app.use('/auth', authRoutes(authRouter))


app.use(express.static(root));
app.use(fallback('index.html', { root }));

app.use((req, res, next) => {
  res.status(404).send('Page not found...');
  next();
});

module.exports = app;

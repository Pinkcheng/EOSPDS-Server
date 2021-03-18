import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';

import apiRouter from './router/api.router';

// Read .env files settings
dotenv.config();

const app = express();

// Create Express server
app.set('port', process.env.PORT || 3000);

// 壓縮
app.use(compression());
// json 排版
app.set('json spaces', 2);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
// 安全選項 https://expressjs.com/zh-tw/advanced/best-practice-security.html
app.use(helmet());

app.set('trust proxy', 1); // trust first proxy

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

app.use('/api', apiRouter);

export default app;


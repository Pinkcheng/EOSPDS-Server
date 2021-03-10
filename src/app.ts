import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';
import uuidv4 from 'uuid/v4';

import router from './router';

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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  genid: function() {
    return uuidv4(); // use UUIDs for session IDs
  },
  cookie: { secure: true }
}));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Pass to next layer of middleware
  next();
});
app.use('/', router);

export default app;


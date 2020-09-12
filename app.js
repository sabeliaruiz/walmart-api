const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const CommonResponse = require('./app/shared/common/common-response');
const productRoute = require('./app/product/product.route');

const app = express();
app.set('trust proxy', true);
const commonResponse = new CommonResponse();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS');
  res.status(200).end();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  next();
});

const basePath = `${config.get('resource.baseResource')}${config.get('resource.version')}`;
const fullPath = `${basePath}${config.get('resource.domain')}`;

app.use((req, _res, next) => {
  const responseTimeVars = {
    initTime: new Date(),
    method: req.method,
    url: req.url
  };
  const res = _res;
  res.locals.responseTimeVars = responseTimeVars;
  next();
});

app.use(fullPath, productRoute);

app.use((req, res) => {
  commonResponse.setResponseWithError(res, 128);
});

app.use((error, req, res, next) => {
  if (error) {
    commonResponse.setResponseWithError(res, 100, error.message);
  } else {
    next();
  }
});

module.exports = app;

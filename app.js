const config = require('./config')
const utils = require('./utils');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const router = express.Router();
const api = require('./routes/api')
const blockchain = require('./controllers/blockcontrollers')


/**
 * Middleware xác thực người dùng dựa vào mã token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


app.use(bodyParser.json());

app.use('/api', api);
app.listen(80, function () {
  console.log('Server is running port 80!');
});



module.exports = app
const config = require('./config')
const utils = require('./utils');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const router = express.Router();
const api = require('./routes/api')
const blockchain = require('./controllers/blockcontrollers')
var redis  = require('redis')

/**
 * Middleware xác thực người dùng dựa vào mã token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

var io = require("socket.io").listen(app.listen(80,function(){console.log('Server Socket runing 80')}));
app.use(bodyParser.json());
var conut = 0
app.use('/api', api);
io.sockets.on('connection',function(socket){
	console.log(socket.id)
	socket.on('nap-tien',function(data){
		// blockchain.NapTien('04c282f6cd1f90c5eb496bbed17103a0ef0f944c9118fbf438146b3c6fbd94f779ceb1d7edc1501a4b2844c6f969aaa7ad67',data)
	io.emit('xac-thuc-di',"Có sự thay đổi")
	})
	socket.on('xac-thuc',function(data){
		if(data){
			conut++
			console.log(conut)
		}
	})

})

module.exports = app
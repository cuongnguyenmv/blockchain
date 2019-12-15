const express = require('express');
const md5 = require('md5');
const sql = require('mssql')
const router = express.Router();
const config = require('./../config')
const utils = require('./../utils');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const tokenList = {};
const blockcontroller = require('./../controllers/blockcontrollers')
const usersmodel = require('./../model/UsersModel')
const blockmodel = require('./../model/BlockModel')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const fs = require('fs')
// login

const db = {
        user: 'sa',
        password: 'Cu@ng123',
        server: '127.0.0.1', 
        database: 'Blockchain',
        port: 1433
    }

router.get('/index',(req,res) => {
  res.send('ok')
})

router.post('/register',  (req, res ) =>{
  const postData = req.body
   const user = {
    "email": postData.email,
    "name": postData.name,
    "password" : postData.password,
    "confirmpwd":postData.confirmpwd
  }
  // if(user.password !== user.confirmpwd)
  //   throw new Error("Nhap password sai ")
  // if(usersmodel.getUser){
  //    throw new Error("User ton tai ")
  // }


  const keyprivate = ec.keyFromPrivate(md5(user.email+md5(user.password)))
  const wallet = keyprivate.getPublic('hex')
  // const prehash = blockmodel.myfunc().curBlock()
  let pool = sql.connect(db)
    var request = new sql.Request()
    request.stream = true
    request.query("SELECT TOP 1 * FROM curBlock order by id DESC")
    request.on('row', row  => {
       usersmodel.regisUser(user.name, user.email, user.password,wallet,row.curhas )

    })
   
})
router.post('/login',  (req, res) => {
  const postData = req.body;
  const user = {
    "email": postData.email,
    "name": postData.name
  }
 const token = jwt.sign(user, config.secret, {
    expiresIn: config.tokenLife,
  });

  // Tạo một mã token khác - Refresh token
  const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenLife
  });

  // Lưu lại mã Refresh token, kèm thông tin của user để sau này sử dụng lại
  tokenList[refreshToken] = user;

  // Trả lại cho user thông tin mã token kèm theo mã Refresh token
  const response = {
    token,
    refreshToken,
  }
  console.log(response)
  res.json(response);
})
router.post('/refresh_token', async (req, res) => {
  // User gửi mã Refresh token kèm theo trong body
  const { refreshToken } = req.body;
  // Kiểm tra Refresh token có được gửi kèm và mã này có tồn tại trên hệ thống hay không
  if ((refreshToken) && (refreshToken in tokenList)) {
    try {
      // Kiểm tra mã Refresh token
      await utils.verifyJwtToken(refreshToken, config.refreshTokenSecret);
      // Lấy lại thông tin user
      const user = tokenList[refreshToken];
      // Tạo mới mã token và trả lại cho user
      const token = jwt.sign(user, config.secret, {
        expiresIn: config.tokenLife,
      });
      const response = {
        token,
      }
      console.log(user)
      res.status(200).json(response);
    } catch (err) {
      res.status(403).json({
        message: 'Invalid refresh token',
      });
    }
  } else {
    res.status(400).json({
      message: 'Invalid request',
    });
  }
});
const TokenCheckMiddleware = async (req, res, next) => {
  // Lấy thông tin mã token được đính kèm trong request
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // Xác thực mã token và kiểm tra thời gian hết hạn của mã
    try {
      const decoded = await utils.verifyJwtToken(token, config.secret);
      // Lưu thông tin giã mã được vào đối tượng req, dùng cho các xử lý ở sau
      req.decoded = decoded;
      next();
    } catch (err) {
      // Giải mã gặp lỗi: Không đúng, hết hạn...
      console.error(err);
      return res.status(401).json({
        message: 'Unauthorized access.',
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
}
// router.use(TokenCheckMiddleware);
// router.get('/profile', (req, res) => {
//   // all secured routes goes here
//   res.json(req.decoded)
// })

// router.get('nap-tien',(req,res) => {
//    blockcontroller.NapTien = 
// })

module.exports = router
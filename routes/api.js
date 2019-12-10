const express = require('express');
const router = express.Router();
const config = require('./../config')
const utils = require('./../utils');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const tokenList = {};
const blockcontroller = require('./../controllers/blockcontrollers')
// login
// Router.post('/register',(req ,res )=>{
//   const postData = req.bodyParser
//   const user = {
//     "email": postData.email,
//     "name": postData.name,
//     "password" : postData.password
//   },
//   // Kiem tra user neu ton tai thi 
//   if(){
//     res.send("Users exists")
//   }
//   else
//   {
    
//   }
// })

router.post('/login', (req, res) => {
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
router.get('/profile', (req, res) => {
  // all secured routes goes here
  res.json(req.decoded)
})
router.get('/create-block',blockcontroller.pow)
module.exports = router
require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    console.log(">>> check token: ", token)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'user',
        createdBy: "included"
      }
      console.log(">>> check token: ", decoded)
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token bị hết hạn/không hợp lệ"
      })
    }
  } else {
    return res.status(401).json({
      message: "Bạn chưa truyền Access Token ở header/không token bị hết hạn"
    })
  }
}

module.exports = auth;

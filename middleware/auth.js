const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 用户身份验证中间件
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取token
      token = req.headers.authorization.split(' ')[1];

      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息（不含密码）
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: '未授权，token失效' });
    }
  }

  if (!token) {
    res.status(401).json({ message: '未授权，无token' });
  }
};

// 管理员权限中间件
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '没有管理员权限' });
  }
};

module.exports = { protect, admin };

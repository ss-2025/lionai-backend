const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateMembership,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// 用户注册路由
router.post('/', registerUser);

// 用户登录路由
router.post('/login', loginUser);

// 获取个人资料路由 - 需要token验证
router.get('/profile', protect, getUserProfile);

// 更新会员信息路由 - 需要token验证
router.put('/membership', protect, updateMembership);

module.exports = router;

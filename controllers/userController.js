const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    注册新用户
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 创建新用户
    const user = await User.create({
      username,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        membership: user.membership,
        credits: user.credits,
        membershipDays: user.membershipDays,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: '无效的用户数据' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    用户登录
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ username });

    // 验证用户和密码
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        membership: user.membership,
        credits: user.credits,
        membershipDays: user.membershipDays,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: '用户名或密码错误' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取用户资料
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        membership: user.membership,
        credits: user.credits,
        membershipDays: user.membershipDays,
      });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新会员信息
// @route   PUT /api/users/membership
// @access  Private
const updateMembership = async (req, res) => {
  try {
    const { membership, credits, membershipDays } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      if (membership) user.membership = membership;
      if (credits) user.credits = credits;
      if (membershipDays) user.membershipDays = membershipDays;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        membership: updatedUser.membership,
        credits: updatedUser.credits,
        membershipDays: updatedUser.membershipDays,
      });
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateMembership,
};

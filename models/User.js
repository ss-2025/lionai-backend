const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, '请提供用户名'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, '请提供密码'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    membership: {
      type: String,
      enum: ['free', 'basic', 'pro', 'bulk'],
      default: 'free',
    },
    credits: {
      type: Number,
      default: 0,
    },
    membershipDays: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 密码加密中间件
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 密码验证方法
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

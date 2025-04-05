require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 路由
app.use('/api/users', userRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Lion AI API 运行中' });
});

// 端口设置
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

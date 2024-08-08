const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Access token is invalid or expired' });
    }

    const user = await User.findOne({ ID: decoded.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = authenticateToken;

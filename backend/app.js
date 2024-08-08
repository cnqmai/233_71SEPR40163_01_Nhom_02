require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

const { connectToMongoDB, closeConnection } = require('./config/database');
const authenticateToken = require('./middlewares/authenticateToken');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const authorRoutes = require('./routes/author');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const genreRoutes = require('./routes/genre');
const reviewRoutes = require('./routes/review');
const commentRoutes = require('./routes/comment');
const postRoutes = require('./routes/post');

// Kết nối tới MongoDB
connectToMongoDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình cho phép CORS từ origin http://localhost:3001
app.use(cors({
  origin: 'http://localhost:3001', // Cho phép từ origin của frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Cho phép các phương thức này
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được cho phép
}));

app.use('/api/auth', authRoutes);
app.use('/api/books', authenticateToken, bookRoutes);
app.use('/api/authors', authenticateToken, authorRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/groups', authenticateToken, groupRoutes);
app.use('/api/posts', authenticateToken, postRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/reviews', authenticateToken, reviewRoutes);
app.use('/api/comments', authenticateToken, commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

module.exports = app;

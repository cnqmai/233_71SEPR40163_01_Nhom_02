const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

// Định nghĩa route cho việc lấy danh sách người dùng
router.get('/getallgenres', genreController.getAllGenres);

module.exports = router;

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Lấy Post với Comments
router.get('/getpostwithcomments/:id', postController.getPostWithComments);

router.post('/addpost', postController.addPost);

module.exports = router;

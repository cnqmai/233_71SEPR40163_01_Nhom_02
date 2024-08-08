const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/addcomment', commentController.addComment);

module.exports = router;

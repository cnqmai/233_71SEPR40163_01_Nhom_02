const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/getreviewsbybookname/:name', reviewController.getReviewsByBookName);

router.get('/getreviewsbyuser/:userid', reviewController.getReviewsByUserID);

router.post('/addreviewforbook', reviewController.addReview);

module.exports = router;

const express = require('express');
const router = express.Router({mergeParams:true});
const wrapasync = require('../utilities/wrapasync');
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview,wrapasync(reviews.makeReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, wrapasync(reviews.deleteReview));

module.exports=router;
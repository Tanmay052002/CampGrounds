const express=require('express');
const router=express.Router({mergeParams:true});
const Review = require('../models/reviews');
const Campground=require('../models/campground');
const wrapasync=require('../utilities/wrapasync');
const AppError = require('../utilities/AppError');
const {reviewSchema}=require('../schema');
const session = require('express-session');
const flash = require('connect-flash');
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview,wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const review=new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();   
    // res.send("hello");
    req.flash('success','Successfully added the review');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, wrapasync(async (req,res) => {
    const {id,reviewId}=req.params;
    const review=await Review.findByIdAndDelete(reviewId);
    const camp=await Campground.findById(id);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    // await review.save();
    // await camp.reviews.findById(reviewId);
    req.flash('success','Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;
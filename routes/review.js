const express=require('express');
const router=express.Router({mergeParams:true});
const Review = require('../models/reviews');
const Campground=require('../models/campground');
const wrapasync=require('../utilities/wrapasync');
const AppError = require('../utilities/AppError');
const {reviewSchema}=require('../schema');

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    // console.log(error);
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',');
        throw new AppError(400,msg);
    }
    else{
        next();
    }
}

router.post('/',validateReview,wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const review=new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();   
    // res.send("hello");
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId',wrapasync(async (req,res) => {
    const {id,reviewId}=req.params;
    const review=await Review.findByIdAndDelete(reviewId);
    const camp=await Campground.findById(id);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    // await review.save();
    // await camp.reviews.findById(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;
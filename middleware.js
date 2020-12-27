const Campground = require('./models/campground');
const Review = require('./models/reviews');
const AppError = require('./utilities/AppError');
const {reviewSchema,campSchema} = require('./schema');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.userUrl = req.originalUrl;
        req.flash('error','You must be Logged In to Access That !!!!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCamp=(req,res,next)=>{
    const {error}=campSchema.validate(req.body);
    if(error)
    {
        throw new AppError(400,error.details.map(el=>el.message).join(','))
    }
    else{
        next();
    }
}

module.exports.isAuthorize = async (req,res,next) => {
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(el=>el.message).join(',');
        throw new AppError(400,msg);
    }
    else{
        next();
    }
}
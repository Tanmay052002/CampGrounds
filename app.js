const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const ejsMate=require('ejs-mate');
const joi=require('joi');
const Campground=require('./models/campground');
const Review = require('./models/reviews')
const methodOverride=require('method-override');
const wrapasync=require('./utilities/wrapasync');
const AppError = require('./utilities/AppError');
const {campSchema}=require('./schema');
const {reviewSchema}=require('./schema');

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}); 


mongoose.set('useFindAndModify', false);

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const validateCamp=(req,res,next)=>{
    const {error}=campSchema.validate(req.body);
    if(error)
    {
        throw new AppError(400,error.details.map(el=>el.message).join(','))
    }
    else{
        next();
    }
}
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


app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/campgrounds',async (req,res)=>{
    const camps=await Campground.find({});
    res.render('campgrounds/index.ejs',{camps}); 
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new.ejs');
})
app.post('/campgrounds',validateCamp,wrapasync(async (req,res,next)=>{
    
    const camp=new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
    
}))
app.get('/campgrounds/:id',wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate('reviews');
    //          console.log(camp);
    res.render('campgrounds/show.ejs',{camp});
}))
app.get('/campgrounds/:id/edit',wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    res.render('campgrounds/update',{camp});
}))
app.put('/campgrounds/:id',validateCamp,wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id',wrapasync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


app.post('/campgrounds/:id/reviews',validateReview,wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const review=new Review(req.body.review)
    camp.reviews.push(review);
    await review.save();
    await camp.save();   
    // res.send("hello");
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId',wrapasync(async (req,res) => {
    const {id,reviewId}=req.params;
    const review=await Review.findByIdAndDelete(reviewId);
    const camp=await Campground.findById(id);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    // await review.save();
    // await camp.reviews.findById(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*',(req,res,next)=>{
    next(new AppError(404));
})

app.use((err,req,res,next)=>{
    const {status=500}=err;
    if(!err.message)
    {
        err.message="Something Went Wrong";
    }
    res.status(status).render('error',{err});
})

app.listen(3000,()=>{
    console.log("Port 3000");
})
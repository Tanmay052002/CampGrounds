const express=require('express');
const router=express.Router();
const wrapasync=require('../utilities/wrapasync');
const Campground=require('../models/campground');
const {campSchema}=require('../schema');
const AppError = require('../utilities/AppError');


    

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

router.get('',async (req,res)=>{
    const camps=await Campground.find({});
    res.render('campgrounds/index.ejs',{camps}); 
})

router.get('/new',(req,res)=>{
    res.render('campgrounds/new.ejs');
})
router.post('',validateCamp,wrapasync(async (req,res,next)=>{
    
    const camp=new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
    
}))
router.get('/:id',wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate('reviews');
    //          console.log(camp);
    res.render('campgrounds/show.ejs',{camp});
}))
router.get('/:id/edit',wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    res.render('campgrounds/update',{camp});
}))
router.put('/:id',validateCamp,wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id',wrapasync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports=router;
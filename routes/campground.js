const express=require('express');
const router=express.Router();
const wrapasync=require('../utilities/wrapasync');
const Campground=require('../models/campground');
const {campSchema}=require('../schema');
const AppError = require('../utilities/AppError');
const session = require('express-session');
const flash = require('connect-flash');
const {isLoggedIn} = require('../middleware');
    

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
router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/new.ejs');
})
router.post('', isLoggedIn, validateCamp,wrapasync(async (req,res,next)=>{
    const camp=new Campground(req.body.campground);
    await camp.save();
    req.flash('success','Campground made Successfully');
    res.redirect(`/campgrounds/${camp._id}`);
}))
router.get('/:id',wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs',{camp});
}))
router.get('/:id/edit', isLoggedIn,wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/update',{camp});
}))
router.put('/:id', isLoggedIn, validateCamp, wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated the campground');
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, wrapasync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the campground');
    res.redirect('/campgrounds');
}))

module.exports=router;
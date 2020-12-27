const express=require('express');
const router=express.Router();
const wrapasync=require('../utilities/wrapasync');
const Campground=require('../models/campground');
const {campSchema}=require('../schema');
const AppError = require('../utilities/AppError');
const session = require('express-session');
const flash = require('connect-flash');
const {isLoggedIn,isAuthorize,validateCamp} = require('../middleware');


router.get('',async (req,res)=>{
    const camps=await Campground.find({});
    res.render('campgrounds/index.ejs',{camps}); 
})
router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/new.ejs');
})
router.post('', isLoggedIn, validateCamp,wrapasync(async (req,res,next)=>{
    const camp=new Campground(req.body.campground);
    camp.author=req.user._id;
    await camp.save();
    req.flash('success','Campground made Successfully');
    res.redirect(`/campgrounds/${camp._id}`);
}))
router.get('/:id',wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs',{camp});
}))
router.get('/:id/edit', isLoggedIn, isAuthorize, wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/update',{camp});
}))
router.put('/:id', isLoggedIn, isAuthorize, validateCamp, wrapasync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated the campground');
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, isAuthorize, wrapasync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the campground');
    res.redirect('/campgrounds');
}))

module.exports=router;
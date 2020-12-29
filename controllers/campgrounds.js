const Campground = require('../models/campground');

module.exports.homePage = async (req,res)=>{
    const camps=await Campground.find({});
    res.render('campgrounds/index.ejs',{camps}); 
}
module.exports.renderNewCampgroundForm = (req,res)=>{
    res.render('campgrounds/new.ejs');
}
module.exports.makeNewCampground = async (req,res,next)=>{
    const camp=new Campground(req.body.campground);
    camp.author=req.user._id;
    camp.image = req.files.map(f =>({url:f.path,filename:f.filename}));
    await camp.save();
    console.log(camp.image);
    req.flash('success','Campground made Successfully');
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.singleCampground = async (req,res)=>{
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
}
module.exports.renderUpdateCampgroundForm = async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/update',{camp});
}
module.exports.updateCampground = async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated the campground');
    res.redirect(`/campgrounds/${id}`)
}
module.exports.deleteCampground = async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the campground');
    res.redirect('/campgrounds');
}


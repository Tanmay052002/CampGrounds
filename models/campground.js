const mongoose=require('mongoose');
const schema=mongoose.Schema;

const CampgroundSchema=new schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:String
})

module.exports=mongoose.model('Campground',CampgroundSchema);

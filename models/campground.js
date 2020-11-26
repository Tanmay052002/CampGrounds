const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const CampgroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:String,
    reviews:[
        {
            type:Schema.Types.ObjectID,
            ref:'Review'
        }
    ]
})

module.exports=mongoose.model('Campground',CampgroundSchema);

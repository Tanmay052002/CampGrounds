const mongoose=require('mongoose');
const Review=require('./reviews')
const Schema=mongoose.Schema;

const CampgroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground',CampgroundSchema);

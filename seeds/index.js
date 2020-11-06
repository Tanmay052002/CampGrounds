const mongoose=require('mongoose');
const Campground=require('../models/campground');
const {descriptors,places}=require("./seedhandler")
const cities=require('./cities');
const campground = require('../models/campground');

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const addCamp=async ()=>{
    await Campground.deleteMany({});
    for(let i=1;i<50;i++)
    {
        const randomNo=Math.floor(Math.random()*1000);
        const camp=new Campground({
            location:`${cities[randomNo].city}, ${cities[randomNo].state}`,
            title:`${places[randomNo]}, ${descriptors[randomNo]}`,
        })
        await camp.save();
    }
    // const c=new Campground({titile:"Fever "})
    // await c.save();
}

addCamp();
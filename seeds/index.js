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

const sample= arr => { 
    let randomNo=Math.floor(Math.random()*arr.length)
    return arr[randomNo];   
}

const addCamp=async ()=>{
    await Campground.deleteMany({});
    for(let i=1;i<50;i++)
    {
        let randomNo=Math.floor(Math.random()*1000);
        let randomPrice=Math.floor(Math.random()*300)+30;
        const camp=new Campground({
            author: "5fe739a2ad49226a1c5c5d0f",
            location:`${cities[randomNo].city}, ${cities[randomNo].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
                image:[
                    {
                      url: 'https://res.cloudinary.com/dbd2wzwbs/image/upload/v1609214458/YelpCamp/jcjbobjtcbvpo1oc6kab.jpg',
                      filename: 'YelpCamp/jcjbobjtcbvpo1oc6kab'
                    },
                    { 
                      url: 'https://res.cloudinary.com/dbd2wzwbs/image/upload/v1609214458/YelpCamp/dik38i2v5udmokufxooq.jpg',
                      filename: 'YelpCamp/dik38i2v5udmokufxooq'
                    }
                  ],
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            price:randomPrice,
        })
        await camp.save();
    }
    // const c=new Campground({titile:"Fever "})
    // await c.save();
}

addCamp();
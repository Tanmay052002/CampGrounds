const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const AppError = require('./utilities/AppError');
const session = require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campground');
const reviewRoutes=require('./routes/review');

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
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'why would i tell you',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.signedUser = req.user;
    res.locals.sucMsg = req.flash('success');
    res.locals.errMsg = req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.get('/fake',async (req,res)=>{
    const user = new User({ email:"asd@gmail.com" , username:"asd45" });
    const u = await User.register(user,'pass');
    res.send(u);
})




app.get('/',(req,res)=>{
    res.render('home');
})

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
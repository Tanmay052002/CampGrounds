if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const options = require('./csp');

const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campground');
const reviewRoutes=require('./routes/review');
const mongoDBStore = require('connect-mongo')(session);
const dburl = process.env.DB_URL||'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dburl,{
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
app.use(mongoSanitize({
    replaceWith:'_'
}))
const secret = process.env.SECRET || 'why would i tell you';
const store = new mongoDBStore({
    url: dburl,
    secret,
    touchAfter: 24*3600
})
store.on("error",function(e){
    console.log("Session Store Error",e);
})
const sessionConfig = {
    // store,
    name: 'qwerty',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


app.use(helmet.contentSecurityPolicy(options));

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
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Port ${port}`);
})
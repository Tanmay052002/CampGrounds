const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapasync = require('../utilities/wrapasync');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
})
router.post('/register',wrapasync (async (req,res,next)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username,email});
        const registerUser = await User.register(user, password);
        // console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err) return next(err);
            req.flash('success','Successfully Registered !!!!!');
            res.redirect('/campgrounds');
        });
    } catch(e) {
        req.flash('error',e.message);
        res.redirect('/register');  
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login');
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), (req,res)=>{
    req.flash('success','Happy to See You Again!!');    
    const directToUrl = req.session.userUrl || '/campgrounds';
    delete req.session.userUrl;
    res.redirect(directToUrl);
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Waiting for You to Come Again !!');
    res.redirect('/campgrounds');
})

module.exports = router;
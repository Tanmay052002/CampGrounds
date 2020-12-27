const User = require('../models/user');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register');
}
module.exports.registerUser = async (req,res,next)=>{
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
        console.log(e);
        req.flash('error',e.message);
        res.redirect('/register');  
    }
}
module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login');
}
module.exports.afterLoginPage = (req,res)=>{
    req.flash('success','Happy to See You Again!!');    
    const directToUrl = req.session.userUrl || '/campgrounds';
    delete req.session.userUrl;
    res.redirect(directToUrl);
}
module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','Waiting for You to Come Again !!');
    res.redirect('/campgrounds');
}
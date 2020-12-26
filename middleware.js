module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.userUrl = req.originalUrl;
        req.flash('error','You must be Logged In to Access That !!!!');
        return res.redirect('/login');
    }
    next();
}
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapasync = require('../utilities/wrapasync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(wrapasync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), users.afterLoginPage);

router.get('/logout',users.logout);

module.exports = router;
const express=require('express');
const router=express.Router();
const wrapasync=require('../utilities/wrapasync');
const {isLoggedIn,isAuthorize,validateCamp} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.homePage)
    .post(isLoggedIn,upload.array('image'), validateCamp,wrapasync(campgrounds.makeNewCampground));
    

router.get('/new', isLoggedIn, campgrounds.renderNewCampgroundForm)

router.route('/:id')
    .get(wrapasync(campgrounds.singleCampground))
    .put(isLoggedIn, isAuthorize, upload.array('image'),validateCamp, wrapasync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthorize, wrapasync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthorize, wrapasync(campgrounds.renderUpdateCampgroundForm))

module.exports=router;
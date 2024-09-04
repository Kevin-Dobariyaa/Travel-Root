const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

// Validation for schema using joi

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
        // multiple error
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please Login to Traval Root");
        res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        // console.log(res.locals.redirectUrl);
    }
    next();
}

module.exports.isCreatedBy = wrapAsync (async (req,res,next) =>{
    
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.createdBy.equals(res.locals.currUser._id)){
        req.flash( "error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}); 

module.exports.isReviewCreatedBy = wrapAsync (async (req,res,next) =>{
    
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash( "error","You can't delete this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}); 
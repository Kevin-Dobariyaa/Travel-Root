const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js")


// Validation for schema using joi

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
        // multiple error
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// Index Route
router.get("/", 
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

// New & Create Route

router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

router.post("/listings", validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// Edit & Update Route
router.get("/:id/edit", 
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    })
);

router.put("/:id", validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        // res.redirect(`/listings`);
        res.redirect(`/listings/${id}`);
    })
);

// Delete Route
router.delete("/:id", 
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deleted = await Listing.findByIdAndDelete(id);
        console.log(deleted);
        res.redirect("/listings");
    })
);

// Show Route
router.get("/:id", 
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", { listing });
    })
);

module.exports = router;
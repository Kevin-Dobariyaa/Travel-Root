const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isCreatedBy, validateListing} = require("../middleware.js");



// Index Route
router.get("/", 
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

// New & Create Route

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

router.post("/", isLoggedIn, validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        newListing.createdBy = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    })
);

// Edit & Update Route
router.get("/:id/edit", isLoggedIn, isCreatedBy,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing Not Found");
            res.redirect("/listings");
        }else{
            res.render("listings/edit.ejs", { listing });
        }
    })
);

router.put("/:id",isLoggedIn, isCreatedBy ,validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success","Listing Edited!");
        res.redirect(`/listings/${id}`);
    })
);

// Delete Route
router.delete("/:id", isLoggedIn, isCreatedBy,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deleted = await Listing.findByIdAndDelete(id);
        console.log(deleted);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
    })
);

// Show Route
router.get("/:id", 
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path:"reviews",
                populate:{
                    path:"author",
                },
            })
            .populate("createdBy");

        if(!listing){
            req.flash("error","Listing Not Found");
            res.redirect("/listings");
        }else{
            // console.log(listing);
            res.render("listings/show.ejs", { listing });
        }
    })
);

module.exports = router;
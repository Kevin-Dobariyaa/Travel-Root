const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({accessToken: process.env.MAP_TOKEN});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.postListing = async (req, res, next) => {

    let map = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();
        
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);

    newListing.createdBy = req.user._id;
    url.replace("/upload/h_300,w_250","/upload/h_100,w_100");
    newListing.image = {url,filename};
    newListing.geometry = map.body.features[0].geometry;

    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Not Found");
        res.redirect("/listings");
    }else{
        res.render("listings/edit.ejs", { listing });
    }
}

module.exports.editPut = async (req, res) => {
    let { id } = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image= {url,filename};
        await listing.save();
    }

    let map = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location    ,
            limit: 1,
        })
        .send();
        
    listing.geometry = map.body.features[0].geometry;
    await listing.save();

    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
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
}
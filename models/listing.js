const mongoose = require("mongoose");
const defalutImg = ""
const listingSchema = new mongoose.Schema({
    title: {
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        type:String,

        // defalult is use when image is not declared or undefing
        default : "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set is use when image is come but it is empty
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,


    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

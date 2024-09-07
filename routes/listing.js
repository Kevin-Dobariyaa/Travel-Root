const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn, isCreatedBy, validateListing } = require("../middleware.js");
const { index, newListing, postListing, editForm, editPut, destroyListing, showListing } = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");

const upload = multer({ storage })


router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn,
        upload.single('listing[image]'), 
        validateListing,
        wrapAsync(postListing));

router.get("/new", isLoggedIn, newListing);

router.get("/:id/edit", 
    isLoggedIn, 
    isCreatedBy, 
    wrapAsync(editForm));

router.route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedIn, 
        isCreatedBy,         
        upload.single('listing[image]'), 
        validateListing, 
        wrapAsync(editPut))
    .delete(isLoggedIn, 
        isCreatedBy, 
        wrapAsync(destroyListing));

module.exports = router;
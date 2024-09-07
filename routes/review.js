const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const { validateReview, isLoggedIn, isReviewCreatedBy } = require("../middleware.js");
const { createReview, destoryReview } = require("../controllers/reviews.js");


// Post reviews

router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Reviews 
router.delete("/:reviewId", isLoggedIn, isReviewCreatedBy, wrapAsync(destoryReview))

module.exports = router;
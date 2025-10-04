const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
// Post review
router.post("/", async (req, res)=>{
let Listings = await Listing.findById(req.params.id);
let newreview = new Review(req.body.review);
Listings.reviews.push(newreview);
await newreview.save();
await Listings.save();
req.flash("success", "Successfully made a new review");
console.log("Review Added");
res.redirect(`/Listings/${Listings._id}`);
});

//Delete review rout 
router.delete("/:reviewId",
   wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params; 
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Successfully deleted a review");
    console.log("Deleted Successfully");
    res.redirect(`/Listings/${id}`);
   })
  
);

module.exports = router;
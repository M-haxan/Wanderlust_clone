const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
// All listings route
router.get("/Listings", async (req, res) => {
  // Pagination logic
  const page = parseInt(req.query.page) || 1; //Current page number (default 1)
  const limit = 6;
  // listings skip karni hain (formula)
  const skip = (page - 1) * limit;
  // counting the total pages
  const totalListings = await Listing.countDocuments();
  // Required listings
  const listings = await Listing.find({}).skip(skip).limit(limit);
  // Total pages (for Next/Prev button)
  const totalPages = Math.ceil(totalListings / limit);
  // Data to be sent to the template
  res.render("./Listings/index.ejs", {
    allListings: listings,
    page,
    totalPages,
  });
});
// Create New Liting route
router.get("/Listings/new", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  res.render("./Listings/new.ejs");
});
// Post new listing
router.post("/Listings", (req, res) => {
  const listing = new Listing(req.body.Listing);
  listing.save();
  req.flash("success", "Successfully made a new listing");
  res.redirect("/Listings");
});
// show route
router.get("/Listings/:id", async (req, res) => {
  let { id } = req.params;
  console.log("ID received:", id);
  const listing = await Listing.findById(id).populate("reviews");
  res.render("./Listings/show.ejs", { listing });
  //console.log(list);
  // res.send("working")
});

//delete Rout
router.delete("/Listings/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  let { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a listing");
  console.log(deleted);
  res.redirect("/Listings");
});
// put rout
router.put("/Listings/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
  res.redirect(`/Listings/${id}`);
});

//Edit rout
router.get("/Listings/:id/edit", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./Listings/edit.ejs", { listing });
});
module.exports = router;

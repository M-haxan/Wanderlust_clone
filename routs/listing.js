const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
// All listings route
router.get("/Listings", async (req, res) => {
  //const allListings = await Listing.find({});
// 1️⃣ Current page number le lo (user se)
  // URL se aata hai jaise: /Listings?page=2
  const page = parseInt(req.query.page) || 1;  
  // agar ?page= nahi diya gaya, to by default page 1

  // 2️⃣ Kitni listings per page dikhani hain
  const limit = 6;  

  // 3️⃣ Kitni listings skip karni hain (formula)
  // Suppose page 2 par ho, to (2-1)*6 = 6 skip karni hain
  const skip = (page - 1) * limit;

  // 4️⃣ Total documents count karo (for total pages)
  const totalListings = await Listing.countDocuments();

  // 5️⃣ Required listings lo, skip aur limit laga ke
  const listings = await Listing.find({}).skip(skip).limit(limit);

  // 6️⃣ Total pages calculate karo (for Next/Prev button)
  const totalPages = Math.ceil(totalListings / limit);

  // 7️⃣ Data bhejo EJS file me
  res.render("./Listings/index.ejs", { allListings: listings, page, totalPages });
});
// Create New Liting route
router.get("/Listings/new", (req, res)=>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  res.render("./Listings/new.ejs")
})
// Post new listing
router.post("/Listings", (req,res)=>{
  const listing = new Listing(req.body.Listing);
  listing.save();
  req.flash("success", "Successfully made a new listing");
  res.redirect("/Listings");
});
// show route
router.get("/Listings/:id", async (req, res)=>{
    let {id} = req.params;
    console.log("ID received:", id);
    const listing = await Listing.findById(id).populate('reviews');
    res.render("./Listings/show.ejs", {listing});
    //console.log(list);
   // res.send("working")
})

//delete Rout

router.delete("/Listings/:id", async(req, res)=>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  let {id} = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
 req.flash("success", "Successfully deleted a listing");
  console.log(deleted);
  res.redirect("/Listings");
})

// put rout
router.put("/Listings/:id", async (req, res)=>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  let {id} =req.params;
await   Listing.findByIdAndUpdate(id, {...req.body.Listing});
  res.redirect(`/Listings/${id}`)
})

//Edit rout
router.get("/Listings/:id/edit", async(req,res)=>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  let {id} = req.params;
  const listing = await  Listing.findById(id);
  res.render("./Listings/edit.ejs", {listing});
})

module.exports = router;
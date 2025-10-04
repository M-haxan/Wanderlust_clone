const express = require("express");
const router = express.Router({mergeParams: true});
const user = require("../models/user.js");
const passport = require("passport");
router.get("/signup", (req, res)=>{
  res.render("users/signup.ejs");
});
router.post("/signup",async (req, res)=>{
  let {username, password, email} = req.body;
  const newuser = new user({username, email});// creating a new user instance
  let registereduser = await user.register(newuser, password);// registering the user with passport-local-mongoose
    console.log(registereduser);
    req.flash("success", "Successfully registered!");
    res.redirect("/Listings");

});
router.get("/login", (req, res)=>{
res.render("users/login.ejs");
})

router.post("/login",passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res)=>{
    req.flash("success", "Welcome back!");  
    res.redirect("/Listings");
})
module.exports = router;
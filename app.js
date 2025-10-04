const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require('ejs-mate')
const methodoverride = require("method-override");
const { console } = require("inspector");
const listingRoutes = require("./routs/listing.js");
const reviewRoutes = require("./routs/reviews.js");
const UserRoutes = require("./routs/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




app.set("view engine", "ejs");
app.engine('ejs', ejsmate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(() => {
  {
    console.log("connected to db");
  }
});

app.listen(8080, () => {
  console.log("app is listening");
});
app.get("/", (req, res) => {
  res.send("This is root");
});
sessionOptions = {
  secret: "SupperSecret",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use(listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", UserRoutes);

//  app.get("/testListing", async (req, res)=>{
//     let sampletesting = new Listing({
//         title : "Afaq",
//         description: "Hello this is Afaq",
//         price: 2000,
//         image : "",
//         location: "Multan",
//         country: "Pakistan",
//     });
//     await sampletesting.save();
//     console.log("Saved Successful");
//     res.send("Working");
//  });










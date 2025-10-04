const mongoose = require("mongoose"); // Importing mongoose

const Schema = mongoose.Schema; // Getting Schema from mongoose

// Defining the review schema

const reviewschema = new Schema({
    comment : String,
    rating:{
        type: Number,
        min : 1,
        max : 5
    },
    createdat:{
        type: Date,
        default: Date.now,
    }
});
module.exports = mongoose.model("Review", reviewschema); // Exporting the Review model